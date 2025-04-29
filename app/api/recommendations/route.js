import { connectToDB} from '@/lib/mongodb';
import Investor from '@/models/Investor';
import Propose from '@/models/Propose';
export async function GET(req) {
  try {
    await connectToDB();

    const url = new URL(req.url);
    const investorId = url.searchParams.get('investorId');
    console.log('Investor ID:', investorId);

    // 2. Fetch the investor
    const investor = await Investor.findById(investorId);
    if (!investor) {
      return new Response(JSON.stringify({ message: 'Investor not found' }), { status: 404 });
    }

    // 3. Fetch all proposals
    const proposals = await Propose.find();
    console.log('Proposals fetched:', proposals.length, 'proposals');

    // 4. Calculate recommendation score
    const recommendations = proposals.map(proposal => {
      let score = 0;

      // Industry match
      if (investor.preferredIndustries?.includes(proposal.industry)) {
        score += 5;
        console.log(`Industry match for ${proposal.startupName}, score: ${score}`);
      }

      // Investment focus match
      if (investor.investmentFocus === proposal.stage) {
        score += 3;
        console.log(`Investment focus match for ${proposal.startupName}, score: ${score}`);
      }

      // Investment size match
      if (investor.investmentSize === proposal.funding) {
        score += 2;
        console.log(`Investment size match for ${proposal.startupName}, score: ${score}`);
      }

      return { proposal, score };
    });

    // 5. Sort by score, pick top 5 recommendations
    recommendations.sort((a, b) => b.score - a.score);
    console.log('Sorted recommendations by score.');

    const topRecommendations = recommendations.slice(0, 5).map(rec => rec.proposal);
    console.log('Top 5 recommendations:', topRecommendations);

    return new Response(JSON.stringify(topRecommendations), { status: 200 });

  } catch (error) {
    console.error('Error during API execution:', error);
    return new Response(JSON.stringify({ message: 'Server Error' }), { status: 500 });
  }
}
