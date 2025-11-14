import {Client, Databases, ID, Query} from 'appwrite'

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECCTION_ID;

//define new appwrite client
const client =  new Client()
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject(PROJECT_ID)



const database = new Databases(client);


export const updateSearchCount =  async (searchTerm, movie) => {
    // 1. use appwrite SDK to check is searchTerm exists in the DB
    try{
        const result = await database.listTransactions(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', searchTerm),
        ])
    // 2. if it does update the count
        if(result.documents.length > 0){
            const doc = result.documents[0];

            await database.updateTransaction(DATABASE_ID,COLLECTION_ID, doc.$id, {
                count: doc.count + 1,
            })
    // 3. if it doeasn't create a new document with the searchTerm and count as 1
        } else {
            await database.createTransaction(DATABASE_ID,COLLECTION_ID, ID.unique(), {
            searchTerm,
            count: 1,
            movie_id: movie.id,
            poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            })
        }
    } catch (error){
        console.log(error)

    }

}