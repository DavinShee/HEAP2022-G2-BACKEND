require('dotenv').config();
const Airtable = require('airtable');
const documentModel = require('../models/document');

const airtableApiKey = process.env.AIRTABLE_KEY;
const airtableAppId = process.env.AIRTABLE_APP_ID;
const base = new Airtable({ apiKey: airtableApiKey }).base(airtableAppId);

// create document record into mongoDB
async function createDocumentRecord(noteId, documentId) {
    try {
        const doc = {
            noteId,
            documentId
        };
        let document = new documentModel(doc);
        document = await document.save();
        return [undefined, document];
    } catch (error) {
        console.error('Error creating document record', error);
        return [error, null];
    }
}

// utilize Airtable API to create a new document record in Airtable DB
async function createAirtableDocument(noteId, document) {
    let createdAirtableDocument;
    await base('Projects')
        .create([
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
        ])
        .then(function (record) {
            const documentId = record[0].id;
            createdAirtableDocument = documentId;
        });
    return createdAirtableDocument;
}

// get documentId based on noteId from mongoDB
async function retrieveDocumentId(noteId) {
    try {
        const query = documentModel.find({ noteId });
        const document = await query.exec();
        const documentId = document[0].documentId;
        return [undefined, documentId];
    } catch (error) {
        console.error('Error retrieving documentId', error);
        return [error, null];
    }
}
// get documentURL from Airtable DB based on documentId as key
async function retrieveAirtableDocument(documentId) {
    try {
        let document;
        await base('Projects')
            .find(`${documentId}`)
            .then(function (record) {
                const documentUrl = record.fields.document[0].url;
                document = documentUrl;
            });
        return [undefined, document];
    } catch (error) {
        console.error('Error retrieving airtable document', error);
        return [error, null];
    }
}
module.exports = {
    createDocument: async (noteId, document) => {
        try {
            // create document on Airtable first
            const createdAirtableDocument = await createAirtableDocument(
                noteId,
                document
            );
            // create document record in mongoDB
            const [createDocumentRecordError, createdDocumentRecord] =
                await createDocumentRecord(noteId, createdAirtableDocument);
            if (createDocumentRecordError) throw createDocumentRecordError;

            return [undefined, createdDocumentRecord];
        } catch (error) {
            console.error('Error creating note with Airtable', error);
            return [error, null];
        }
    },
    retrieveDocument: async (noteId) => {
        try {
            // get documentId from mongoDB based on noteId
            const [retrieveDocumentError, documentId] =
                await retrieveDocumentId(noteId);
            if (retrieveDocumentError) throw retrieveDocumentError;

            // get documentURL from Airtable DB based on documentId as key
            const [retrieveAirtableDocumentError, document] =
                await retrieveAirtableDocument(documentId);
            if (retrieveAirtableDocumentError)
                throw retrieveAirtableDocumentError;

            return [undefined, document];
        } catch (error) {
            console.error('Error retrieving document', error);
            return [error, null];
        }
    }
};
