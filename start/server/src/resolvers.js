const { paginateResults } = require('./utils')

module.exports = {
    Query: {
        launches: async (_, {pageSize = 20, after }, {dataSources}, info) => {
            // return dataSources.launchAPI.getAllLaunches()
            const allLaunches = await dataSources.launchAPI.getAllLaunches()
            allLaunches.reverse()
            const launches = paginateResults({
                after,
                pageSize,
                results: allLaunches
            })
            return {
                launches,
                cursor: launches.length ? launches[launches.length - 1].cursor : null,
                hasMore: launches.length ? launches[launches.length - 1].cursor !== allLaunches[allLaunches.length - 1].cursor : false
            }
        },
        launch: (_, {id}, {dataSources}, info) => {
            return dataSources.launchAPI.getLaunchById({launchId: id})
        },
        me: (_, __, {dataSources}, info) => {
            return dataSources.userAPI.findOrCreateUser()
        }
    },
    Mutation: {
        login: async(_, {email}, {dataSources}) => {
            const user = await dataSources.userAPI.findOrCreateUser({email})
            if(user){
                user.token = Buffer.from(email).toString(
                    'base64'
                )
                return user
            }
        },
        bookTrips: async (_, {launchIds}, { dataSources }) => {
            const results = await dataSources.userAPI.bookTrips({launchIds})
            const launches = await dataSources.launchAPI.getLaunchesByIds({launchIds})
            const success = results && results.length === launchIds.length

            return {
                success: !!success,
                message: success ? 'trips booked successfully' : `the following launches couldn't be booked ${launchIds.filter(launchId => results ? !results.includes(launchId) : false)}`,
                launches
            }
        },
        cancelTrip: async (_, { launchId }, { dataSources}) => {
            const result = await dataSources.userAPI.cancelTrip({launchId})
            if(result) {
                return {
                    success: result,
                    message: 'trip cancelled'
                }
            }else{
                const launch = await dataSources.launchAPI.getLaunchById({launchId})
                return {
                    success: result,
                    message: 'failed to cancel trip',
                    launches: [launch]
                }
            }
        }
        

    },
    Mission: {
        missionPatch: (mission, {size} = {size: 'LARGE'}) => {
            return size === 'SMALL' ? mission.missionPatchSmall : mission.missionPatchLarge
        }
    },
    Launch: {
        isBooked: async (launch, _, {dataSources}) => {
            return dataSources.userAPI.isBookedOnLaunch({launchId: launch.id})
        }
    },
    User: {
        trips: async(_, __, { dataSources}) => {
            const launchIds = dataSources.userAPI.getLaunchIdsByUser()
            if(!launchIds.length) return []
            return (
                dataSources.userAPI.getLaunchesByIds({
                    launchIds
                }) || []
            )
        }
    }
}