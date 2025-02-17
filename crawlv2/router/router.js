const crawl = require('./crawl');
function router(app){
    app.use('/api/v1', crawl);

}
module.exports = router;