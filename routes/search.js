const express = require('express')
const router = express.Router()
const fetch = require("node-fetch");
const Paper = require("../models/paper")
/**    /search    */


const getData = async url => {
    try {
        const response = await fetch(url);
        const json = await response.json();
        return json
    } catch (error) {
        console.error(error);
        return error
    }
};


router.get('/', async (req, res) => {
    if (req.query.q == undefined) return
    const q = encodeURI(req.query.q)
    if (q.length < 3) return


    const url = "https://api.crossref.org/works?mailto=ms10238@nyu.edu&query="
    console.log(url + q)
    const data = await getData(url + q)
    const json = data.message.items.map(async p => {
        let paper = new Paper()
        console.log(JSON.stringify(p,null,2))
        let keys = {
            title: (p['title'] && p['title'][0]) || "UNKNOWN TITLE",
            reference: {
                title: (p['title'] && p['title'][0]) || "UNKNOWN TITLE",
                publisher: p['publisher'],
                issue: p['issue'], //5
                // license: Array.isArray(p["license"]) && p["license"].map(el=>{return {"URL": el["url"]}}),
                published_print: {date_parts: p["published-print"] && p["published-print"]["date-parts"][0]},
                published_online: {date_parts: p["published-online"] && p["published-online"]["date-parts"][0]},
                abstract: p['abstract'],
                DOI: p["DOI"], //"10.2210/pdb2yz5/pdb"
                type: p["type"], //Journal Article
                authors: p['author'],
                page: p["page"], //"579-555"
                source: p["source"], //Crossref
                journal_title: p['journal-title'], //Journal of...
                key: p['key'], //"10.1029/2007JD008798: bali07"
                volume: p["volume"], //112
                volume_title:p['volume-title'], //OMI Algorithm Theoretical...
                year: p["year"], //2007
                URL: p["URL"], //"http: //dx.doi.org/10.2210/pdb2yz5/pdb"
                ISSN: p['issn-type'],
                ISBN: p['isbn-type'],
                links: p["link"],
                language: p['language'], //en

            }
        }
        paper = Object.assign(paper,keys)
        try {
            let doc = await Paper.findOne({'reference.DOI':paper.reference.DOI}).exec()
            if(doc) return paper
            else return await paper.save()
        } catch (e) {
            console.error(e)
        }
    })

    Promise.all(json).then(d=>{
        let response = JSON.stringify(d.filter(p=>p!=undefined).map(p=>{
            return {label:p.title,value:p._id}
        }))
        res.send(response)
    })


})


module.exports = router