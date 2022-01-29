const crawler = require('crawler-request');

export default async (req, res) => {
  crawler(req.body.url).then((response) => {
    res.status(200).json({data: response.text});
});
};
