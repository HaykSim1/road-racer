const Database = require('@withkoji/database');
const uuid = require('uuid');

function App (app) {
  app.get('/test', async (req, res) => {
    res.status(200).json({
      test: true,
      more: 'more',
    });
  })

  app.get('/leaderboard', async (req, res) => {
    const database = new Database();
    const rawScores = await database.get('leaderboard');

    // We don't want to return private attributes to consumers of this
    // endpoint, so strip them out, sort the records so the top scores
    // appear first, and then only return the top N scores
    const scores = rawScores
    .map(({ name, score, dateCreated }) => ({
      name,
      score: (score) ? score : 0,
      dateCreated
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 50);

    res.status(200).json({
      success: true,
      scores,
    });
  });

  app.post('/leaderboard/save', async (req, res) => {
    const recordId = uuid.v4();
    const recordBody = {
      name: req.body.name,
      score: req.body.score,
      privateAttributes: req.body.privateAttributes,
      dateCreated: Math.round(Date.now() / 1000),
    };

    const database = new Database();
    await database.set('leaderboard', recordId, recordBody);

    res.status(200).json({
      success: true,
    });
  });
}

module.exports = App;
