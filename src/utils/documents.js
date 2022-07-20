require('dotenv').config();
const Airtable = require('airtable');
const documentModel = require('../models/document');

const airtableApiKey = process.env.AIRTABLE_KEY;
const airtableAppId = process.env.AIRTABLE_APP_ID;
const base = new Airtable({ apiKey: airtableApiKey }).base(airtableAppId);

async function createDocumentRecord(noteId, documentId){
    try{
        const doc = {
            noteId,
            documentId
        };
        let document = new documentModel(doc);
        document = await document.save();
        return [undefined, document];
    } catch (error) {
        console.error("Error creating document record", error);
        return [error, null];
    }
}

async function createAirtableDocument (noteId, document) {
    let createdAirtableDocument;
    await base('Projects').create(
        [
            {
                fields: {
                    noteId: noteId,
                    document: [
                        {
                            url: document
                        }
                    ]
                }
            }
        ],
    ).then(function(record) {
        const documentId = record[0].id;
        createdAirtableDocument = documentId
    });
    return createdAirtableDocument;
}

module.exports = {
    createDocument: async (noteId, document) => {
        try {
            const createdAirtableDocument = await createAirtableDocument(noteId, document);
            const [createDocumentRecordError, createdDocumentRecord] = await createDocumentRecord(noteId, createdAirtableDocument);
            if (createDocumentRecordError) throw createDocumentRecordError;
            return [undefined, createdDocumentRecord];
        } catch (error) {
            console.error('Error creating note with Airtable', error);
            return [error, null];
        }
    },
    //retrieveDocument: async (note)
};

