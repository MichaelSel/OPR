const mongoose = require('mongoose')

const paperSchema = new mongoose.Schema({
    title: {type: String, required: true}, //Validation of Ozone Monitoring...
    uploadDate: {type: Date}, //Date pdf was added
    authors: {type: [mongoose.Schema.Types.ObjectId], ref: 'Author'}, //The ids of the authors of this paper (claimed and unclaimed)
    claimed: {type: [mongoose.Schema.Types.ObjectId], ref: 'Author'}, //The ids of the authors that claimed this paper
    date_scraped: {type: Date, default: Date.now()},
    tags: {type: [String]}, //tags / keywords for paper
    pdf_path: {type: String}, //The path of the pdf on S3
    reference: {
        title: {type: String}, //Validation of Ozone Monitoring...
        publisher: {type: String},
        issue: {type: String}, //5
        license: [{
            URL: {type: String},
        }],
        published_print: {
            date_parts: [
                {type: Number}
            ]
        },
        published_online: {
            date_parts: [
                {type: Number}
            ]
        },
        abstract: {type: String},
        DOI: {type: String}, //"10.2210/pdb2yz5/pdb"
        type: {type: String}, //Journal Article
        authors: [{
            given: {type: String}, //Omri
            family: {type: String}, //Raccah
            sequence: {type: String}, //first
            affiliation: [
                {name: {type: String}}
            ]
        }],
        page: {type: String}, //"579-555"
        source: {type: String}, //Crossref
        journal_title: {type: String}, //Journal of...
        key: {type: String}, //"10.1029/2007JD008798: bali07"
        volume: {type: String}, //112
        volume_title: {type: String}, //OMI Algorithm Theoretical...
        year: {type: String}, //2007
        URL: {type: String}, //"http: //dx.doi.org/10.2210/pdb2yz5/pdb"
        ISSN: {
            kind: {type: String}, //print
            value: {type: String}  //0026-0576
        },
        ISBN: {
            kind: {type: String}, //print
            value: {type: String} //9780511709197
        },
        links: [
            {
                URL: {type: String}, //http://....
                content_type: {type: String}, //"text/xml"
                content_version: {type: String}, //"vor"
                intended_application: {type: String} //"text-mining"
            }
        ],
        language: {type: String}, //en

    },
    thread_count: {type: Number, default: 0}

})

// paperSchema.index({ title: 'text', 'reference.authors.family': 'text', },{});


module.exports = mongoose.model('Paper', paperSchema)