import { useEffect, useState } from 'react';
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Star } from "lucide-react";

const LevelAndBadge = () => {
    const [touristBadge, setTouristBadge] = useState(null); // State to store the tourist badge (level)
    const [touristWallet, setTouristWallet] = useState(null); // State to store the tourist wallet

    // Fetch the tourist badge and wallet when the component mounts
    useEffect(() => {
        const fetchTouristBadge = async () => {
            try {
                const username = sessionStorage.getItem("username");
                // Step 1: Fetch the userID using the username
                const reply = await fetch(`http://localhost:8000/getID/${username}`);
                if (!reply.ok) throw new Error("Failed to get tourist ID");

                const { userID } = await reply.json(); // Extract userID from response

                // Step 2: Fetch the tourist level using the userID (pass as a URL parameter)
                const levelReply = await fetch(`http://localhost:8000/getTouristLevel/${userID}`);
                if (!levelReply.ok) throw new Error("Failed to get tourist level");

                const { Badge } = await levelReply.json(); // Extract Badge (level) from response
                setTouristBadge(Badge); // Set the tourist badge (level)

                // Step 3: Fetch the tourist wallet using the userID
                const walletReply = await fetch(`http://localhost:8000/getTouristWallet/${userID}`);
                if (!walletReply.ok) throw new Error("Failed to get tourist wallet");

                const { Wallet } = await walletReply.json(); // Extract Wallet from response
                setTouristWallet(Wallet); // Set the tourist wallet
            } catch (error) {
                console.error('Error fetching tourist data:', error);
            }
        };

        fetchTouristBadge(); // Call the function on mount
    }, []); // This effect runs only once on component mount

    return (
        <Card className="w-full max-w-sm">
            <CardContent className="flex items-center justify-between p-6">
                <Badge>
                    <Star className="mr-1 h-3 w-3" />
                    {touristBadge ? `Level: ${touristBadge}` : 'Loading...'} {/* Displaying Badge */}
                </Badge>
                {/* Displaying Wallet */}
                <div>{touristWallet ? `Wallet: ${touristWallet}` : 'Loading wallet...'}</div>
            </CardContent>
        </Card>
    );
};

export default LevelAndBadge;
