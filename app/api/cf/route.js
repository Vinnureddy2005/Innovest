import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import InvestorResponse from '@/models/InvestorResponse';
import Propose from '@/models/propose'; // Import the Propose schema

// Cosine similarity function
function cosineSimilarity(a, b) {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
}

export async function GET(req) {
  try {
    await connectToDB();

    const responses = await InvestorResponse.find();

    if (!responses.length) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }

    const investors = [...new Set(responses.map(r => r.investorEmail))];
    const startups = [...new Set(
      responses
        .filter(r => r.startupId)
        .map(r => r.startupId.toString())
    )];

    const matrix = investors.map(investorEmail =>
      startups.map(startupId => {
        const match = responses.find(
          r =>
            r.investorEmail === investorEmail &&
            r.startupId &&
            r.startupId.toString() === startupId
        );
        if (!match) return 0;
        return match.invested ? 2 : match.liked ? 1 : 0;
      })
    );

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    if (!email) {
      return NextResponse.json({ error: 'Missing ?email= query param' }, { status: 400 });
    }

    const targetIndex = investors.indexOf(email);
    if (targetIndex === -1) {
      return NextResponse.json({ recommendations: [], message: "Investor not found in dataset" });
    }

    const targetVector = matrix[targetIndex];

    // Compute similarity with all other investors
    const similarities = matrix.map((vector, index) => ({
      index,
      similarity: index === targetIndex ? -1 : cosineSimilarity(targetVector, vector)
    }));

    // Get top K similar investors
    const k = 2;
    const neighbors = similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, k)
      .map(n => n.index);

    const avgScores = startups.map((_, i) => {
      let total = 0;
      let count = 0;
      neighbors.forEach(nIdx => {
        const rating = matrix[nIdx][i];
        if (rating > 0) {
          total += rating;
          count++;
        }
      });
      return count > 0 ? total / count : 0;
    });

    const recommendations = startups
      .map((startupId, i) => ({
        startupId,
        matchScore: avgScores[i]
      }))
      .filter((_, i) => matrix[targetIndex][i] === 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);

    // Fetch full startup details for the recommended startupIds
    const recommendedIds = recommendations.map(r => r.startupId);
    const fullStartups = await Propose.find({
      _id: { $in: recommendedIds }
    });

    // Enrich recommendations with full startup info
    const enrichedRecommendations = fullStartups.map(s => {
      const match = recommendations.find(r => r.startupId === s._id.toString());
      return {
        _id: s._id,
        startupName: s.startupName,
        website:s.website,
        industry: s.industry,
        stage: s.stage,
        funding: s.funding,
        matchScore: match?.matchScore ?? 0
      };
    });

    return NextResponse.json({ recommendations: enrichedRecommendations });

  } catch (error) {
    console.error("⨯ Recommendation Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
