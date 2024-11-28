import { Star, DollarSign, Shield, Award } from 'lucide-react'
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"

export default function HotelCard({
  title,
  price,
  rating,
  provider,
  imageUrl,
  cancellationPolicy,
  sponsor
}) {
  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto">
    <Card className="overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-1/3 h-48 sm:h-auto min-w-[200px]">
          <img
            src={imageUrl}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 ease-in-out hover:scale-105"
          />
          {sponsor && (
            <Badge className="absolute top-2 left-2 bg-yellow-400 text-yellow-900">
              <Award className="w-3 h-3 mr-1" />
              {sponsor}
            </Badge>
          )}
        </div>
        <CardContent className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-bold">{title}</h3>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <span>Provided by</span>
                <span className="font-semibold text-foreground">{provider}</span>
              </div>
            </div>
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400 mr-1" />
              <span className="font-semibold"></span>
            </div>
          </div>
          <div className="flex justify-between items-center mb-4">
  <div className="flex items-center">
    <DollarSign className="w-5 h-5 text-green-600 mr-1" />
    <span className="text-2xl font-bold">{price}</span>
    <span className="text-sm text-muted-foreground ml-1">per night</span>
  </div>
  <button
    className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors relative top-7"
  >
    Book Now
  </button>
</div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Shield className="w-4 h-4 mr-1" />
            <span>{cancellationPolicy}</span>
          </div>
        </CardContent>
      </div>
    </Card>
    </div>
  )
}

