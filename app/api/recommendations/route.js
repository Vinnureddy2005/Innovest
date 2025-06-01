import { connectToDB } from '@/lib/mongodb';
import Investor from '@/models/Investor';
import Propose from '@/models/propose';
import stringSimilarity from 'string-similarity';

export async function GET(req) {
  try {
    await connectToDB();

    const url = new URL(req.url);
    const email = url.searchParams.get('email');

    // 1. Fetch investor
    const investor = await Investor.findOne({ email });
    if (!investor) {
      return new Response(JSON.stringify({ message: 'Investor not found' }), { status: 404 });
    }

    // 2. Fetch all proposals
     const proposals = await Propose.find({}, { file: 0 });


    if (proposals.length === 0) {
      return new Response(JSON.stringify({ message: 'No proposals found' }), { status: 404 });
    }

    const investorIndustries = (investor.preferredIndustries || []).map(i => i.toLowerCase());
    const investorStage = (investor.investmentFocus || '').toLowerCase();
    const investorFunding = (investor.investmentSize || '').toLowerCase();

    // 3. Filter proposals that match industry (case-insensitive)
    const InvestedFilter= proposals.filter(startup => startup.invested === false) ;
    const filtered = InvestedFilter.filter(p =>
       
      investorIndustries.includes((p.industry || '').toLowerCase())
    );

    // 4. Score the proposals
    const scoredProposals = filtered.map(proposal => {
      let score = 5; // Base score for industry match

      // Match: stage
      if ((proposal.stage || '').toLowerCase() === investorStage) {
        score += 3;
      }

      // Match: funding
      if ((proposal.funding || '').toLowerCase() === investorFunding) {
        score += 2;
      }

      // Match: description similarity (optional)
      const proposalDesc = proposal.description || '';
      const textQuery = `${investorIndustries.join(' ')} ${investorStage} ${investorFunding}`;
      const descSim = stringSimilarity.compareTwoStrings(proposalDesc, textQuery);
      score += descSim * 5; // bonus points

      return { proposal, score };
    });

    // 5. Sort by score
    scoredProposals.sort((a, b) => b.score - a.score);

    // 6. Return top 5 proposals
    const topRecommendations = scoredProposals.slice(0, 5).map(rec => rec.proposal);

    return new Response(JSON.stringify(topRecommendations), { status: 200 });

  } catch (error) {
    console.error('Error during recommendation:', error);
    return new Response(JSON.stringify({ message: 'Server Error' }), { status: 500 });
  }
}
