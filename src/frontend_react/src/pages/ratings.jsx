'use client'

import { useState } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"
import { Star, ShoppingBag, Map } from 'lucide-react'
import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from '../components/ui/sheet' // Update the import path if necessary

const items = [
  { id: '1', name: 'Wireless Headphones', type: 'product', image: '/placeholder.svg?height=100&width=100' },
  { id: '2', name: 'Smartwatch', type: 'product', image: '/placeholder.svg?height=100&width=100' },
  { id: '3', name: 'City Tour', type: 'tour', image: '/placeholder.svg?height=100&width=100' },
  { id: '4', name: 'Mountain Hiking Tour', type: 'tour', image: '/placeholder.svg?height=100&width=100' },
]

export default function UserRatings() {
  const [ratings, setRatings] = useState({})
  const [reviews, setReviews] = useState({})

  const handleRatingChange = (itemId, rating) => {
    setRatings(prev => ({ ...prev, [itemId]: rating }))
  }

  const handleReviewChange = (itemId, review) => {
    setReviews(prev => ({ ...prev, [itemId]: review }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Iterate through the ratings and send them to the backend
    for (const itemId in ratings) {
      const userId = "YOUR_USER_ID"; // Replace with actual user ID
      const rating = ratings[itemId];

      try {
        const response = await axios.post('http://localhost:8000/rateProduct', {
          userId,
          productId: itemId,
          rating,
        });
        console.log(response.data.message);
      } catch (error) {
        console.error("Error submitting rating:", error.message);
      }
    }

    console.log('Submitted ratings:', ratings)
    console.log('Submitted reviews:', reviews)
  }

  const StarRating = ({ itemId }) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-6 h-6 cursor-pointer ${
            star <= (ratings[itemId] || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
          onClick={() => handleRatingChange(itemId, star)}
        />
      ))}
    </div>
  )

  return (
    <div className="container mx-auto p-4">
    

      {/* Button to open the sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button className="mt-4">Previous Purchase</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Your Ratings and Reviews</SheetTitle>
            <SheetDescription>
              Here are the ratings and reviews you've submitted.
            </SheetDescription>
          </SheetHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <ShoppingBag className="mr-2" /> Products
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {items.filter(item => item.type === 'product').map(item => (
                  <Card key={item.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />
                        <span>{item.name}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <StarRating itemId={item.id} />
                      <Textarea
                        placeholder="Write your review here..."
                        className="mt-2"
                        value={reviews[item.id] || ''}
                        onChange={(e) => handleReviewChange(item.id, e.target.value)}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Map className="mr-2" /> Tours
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {items.filter(item => item.type === 'tour').map(item => (
                  <Card key={item.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />
                        <span>{item.name}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <StarRating itemId={item.id} />
                      <Textarea
                        placeholder="Write your review here..."
                        className="mt-2"
                        value={reviews[item.id] || ''}
                        onChange={(e) => handleReviewChange(item.id, e.target.value)}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
            
            <Button type="submit" className="mt-6">Submit Ratings</Button>
          </form>

          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
