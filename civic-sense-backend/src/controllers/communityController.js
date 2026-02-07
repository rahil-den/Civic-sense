import CommunityFeed from '../models/CommunityFeed.js';

export const getFeed = async (req, res) => {
    try {
        const feed = await CommunityFeed.find()
            .populate({
                path: 'issue_id',
                select: 'category location image_url status',
                populate: { path: 'area_id', select: 'name' }
            })
            .sort({ created_at: -1 })
            .limit(50);

        res.json(feed);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
