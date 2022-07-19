require('dotenv').config();
const Airtable = require('airtable');
const airtableApiKey = process.env.AIRTABLE_KEY;
const airtableAppId = process.env.AIRTABLE_APP_ID;
const base = new Airtable({ apiKey: airtableApiKey }).base(airtableAppId);

module.exports = {
    createDocument: async (noteId, document) => {
        try {
            base('Projects').create(
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
                function (err, records) {
                    if (err) {
                        console.error(err);
                        throw err;
                    }
                    records.forEach(function (record) {
                        console.log(record.getId());
                    });
                }
            );
            return [undefined, true];
        } catch (error) {
            console.error('Error creating note with Airtable', error);
            return [error, null];
        }
    }
};
