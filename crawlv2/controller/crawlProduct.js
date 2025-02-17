
const cheerio = require("cheerio");

const fetchHtml = require('../util/index')
class Product {
    async crawlProduct(req, res){
        const {link} = req.body;
        if(!link){
            return res.status(400).json({message: "Missing link"})
        }
        const url = `${link}?sort=price.net_asc`;
        const html = await fetchHtml(url);
        if (!html) return;
        const $ = cheerio.load(html);
        let result = [];
        const products = $(".non-pc");
        const api = $("amp-list.k3.i-amphtml-element.i-amphtml-built.i-amphtml-layout-container.i-amphtml-layout").attr("src");
        products.each((index, product) => {
            const productName = $(product).find("h3.zE.zF.qB").text().trim() || null;
            const productPrice = $(product).find("div.z4.nW.e7.gC").text().trim().replace(/\D/g, "") || null;
            const productStore = $(product).find("h5.zM.lc.qB.g").text().trim() || null;
            const productImage = $(product).find("img.z9.z7").attr("src") || null;
            const productRating = parseFloat($(product).find("div.bF.rl.g > span.g.b.t.e5.l").text().trim()) || null;
            
            result.push({
                id: index,
                product_name: productName,
                product_price: productPrice ? parseInt(productPrice) : null,
                product_store: productStore,
                product_image: productImage,
                product_rating: productRating,
                api: api || null,
            });
        });
        if(result.length === 0){
            return res.status(404).json({message: "Product not found"});
        }
        return res.status(200).json({
            status: true,
            data: result
        })
    }
}

module.exports = new Product;  