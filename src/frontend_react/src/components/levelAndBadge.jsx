'use client'

import { useEffect, useState } from 'react'
import { Badge } from "../components/ui/badge"
import { Card, CardContent } from "../components/ui/card"
import { Star, Gem, Crown, Wallet } from 'lucide-react'

const LevelAndBadge = () => {
    const [touristBadge, setTouristBadge] = useState(null)
    const [touristWallet, setTouristWallet] = useState(null)

    useEffect(() => {
        const fetchTouristBadge = async () => {
            try {
                const username = sessionStorage.getItem("username")
                const reply = await fetch(`http://localhost:8000/getID/${username}`)
                if (!reply.ok) throw new Error("Failed to get tourist ID")

                const { userID } = await reply.json()

                const levelReply = await fetch(`http://localhost:8000/getTouristLevel/${userID}`)
                if (!levelReply.ok) throw new Error("Failed to get tourist level")

                const { Badge } = await levelReply.json()
                setTouristBadge(Badge)

                const walletReply = await fetch(`http://localhost:8000/getTouristWallet/${userID}`)
                if (!walletReply.ok) throw new Error("Failed to get tourist wallet")

                const { Wallet } = await walletReply.json()
                setTouristWallet(Wallet)
            } catch (error) {
                console.error('Error fetching tourist data:', error)
            }
        }

        fetchTouristBadge()
    }, [])

    let badgeContent = {
        icon: <Star className="mr-1 h-3 w-3" />,
        text: 'Loading...',
        color: 'bg-gray-500 text-white'
    }

    if (touristBadge === 'level 1') {
        badgeContent = {
            icon: <Star className="mr-1 h-3 w-3" />,
            text: ` ${touristBadge}`,
            color: 'bg-gray-300 text-gray-800'
        }
    } else if (touristBadge === 'level 2') {
        badgeContent = {
            icon: <Gem className="mr-1 h-3 w-3" />,
            text: ` ${touristBadge}`,
            color: 'bg-purple-500 text-white'
        }
    } else if (touristBadge === 'level 3') {
        badgeContent = {
            icon: <Crown className="mr-1 h-3 w-3" />,
            text: ` ${touristBadge}`,
            color: 'bg-yellow-400 text-black'
        }
    } else if (touristBadge !== null) {
        badgeContent = {
            icon: <Star className="mr-1 h-3 w-3" />,
            text: ` ${touristBadge}`,
            color: 'bg-blue-500 text-white'
        }
    }

    return (
        <Card className="w-full max-w-sm">
            <CardContent className="flex items-center justify-between p-6">
                <Badge className={`flex items-center ${badgeContent.color}`}>
                    {badgeContent.icon}
                    {badgeContent.text}
                </Badge>
                <div className="flex items-center">
                    <Wallet className="mr-2 h-4 w-4" />
                    <span>{touristWallet !== null ? `Wallet: ${touristWallet}` : 'Wallet: 0'}</span>
                </div>
            </CardContent>
        </Card>
    )
}

export default LevelAndBadge

