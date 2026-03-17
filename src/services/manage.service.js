import NodeCache from "node-cache"
import Users from "../model/users.js"
const cache = new NodeCache({ stdTTL: 60 }) 
export const getusers = async () => {
    const cachedUsers = cache.get("users")
    if (cachedUsers) {
        return cachedUsers
    }
    const users = await Users.find().select('-passwordHash')
    cache.set("users", users)
    return users
}
export const getLast30DaysAnalytics = async () => {
    const cachedData = cache.get("last_30_days")
    if (cachedData) {
        return cachedData
    }
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const users = await Users.find({ createdAt: { $gte: thirtyDaysAgo } }).select('-passwordHash')
    
    const analytics = Array.from({ length: 32 }, (_, i) => {
        const dayStart = new Date(thirtyDaysAgo)
        dayStart.setDate(dayStart.getDate() + i)
        dayStart.setHours(0, 0, 0, 0)
        
        const dayEnd = new Date(dayStart)
        dayEnd.setHours(23, 59, 59, 999)
        
        const dayUsers = users.filter(u => u.createdAt >= dayStart && u.createdAt <= dayEnd)
        
        return {
            id: i + 1,
            name:[...dayUsers],
            count: dayUsers.length,
            "created_at": dayStart,
            day:  dayStart.toISOString().split('T')[0]
        }
    })
    
    cache.set("last_30_days", analytics)
    return analytics
}
