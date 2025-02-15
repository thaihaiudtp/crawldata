const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

async function fetchHtml(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
                "Accept-Language": "en-US,en;q=0.9",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching URL:", error.message);
        return null;
    }
}

async function getProduct(link) {
    const url = `${link}?sort=price.net_asc`;
    console.time("HTTP Request Time");
    const html = await fetchHtml(url);
    console.timeEnd("HTTP Request Time");

    if (!html) return;
    
    console.time("HTML Parsing Time");
    const $ = cheerio.load(html);
    console.timeEnd("HTML Parsing Time");
    
    let result = [];
    const products = $(".non-pc");
    const api = $("amp-list.k3.i-amphtml-element.i-amphtml-built.i-amphtml-layout-container.i-amphtml-layout").attr("src");
    
    console.time("Looping Through Products");
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
    console.timeEnd("Looping Through Products");
    
    console.time("Saving JSON File");
    fs.writeFileSync("categories_v1.json", JSON.stringify(result, null, 4), "utf-8");
    console.timeEnd("Saving JSON File");

    console.time("Saving CSV File");
    const csvHeader = "id,product_name,product_price,product_store,product_image,product_rating,api\n";
    const csvRows = result.map(p => `${p.id},${p.product_name},${p.product_price},${p.product_store},${p.product_image},${p.product_rating},${p.api}`).join("\n");
    fs.writeFileSync("categories_v1.csv", csvHeader + csvRows, "utf-8");
    console.timeEnd("Saving CSV File");
    
    console.log(`Data saved in 'categories_v1.json' and 'categories_v1.csv'. Total: ${result.length} products.`);
}

getProduct("https://iprice.vn/bep-an/dao/");
