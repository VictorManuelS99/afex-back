const { v4 } = require('uuid')
const AWS = require('aws-sdk')

const createVideo = async (video) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient()
  const id = v4()

  const newVideo = {
    id,
    ...video,
  }

  try {
    await dynamoDb
      .put({
        TableName: 'videos',
        Item: newVideo,
      })
      .promise()

    return await getVideos()
  } catch (error) {
    throw new Error(error)
  }
}

const getVideos = async () => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient()

  try {
    const result = await dynamoDb
      .scan({
        TableName: 'videos',
      })
      .promise()

    return result.Items
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    }
  }
}

const deleteVideo = async (id) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient()

  try {
    await dynamoDb
      .delete({
        TableName: 'videos',
        Key: {
          id,
        },
      })
      .promise()

    return await getVideos()
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = {
  createVideo,
  getVideos,
  deleteVideo,
}
