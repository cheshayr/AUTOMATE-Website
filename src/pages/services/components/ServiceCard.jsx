// ServiceCard.jsx
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2 } from 'lucide-react';
import { formatToPHP } from '@/utils/formatters';
import { useDeleteService } from '@/hooks/useServices.mutation';
import { useState } from 'react';

export function ServiceCard({ data, handleEdit }) {
  const deleteServiceMutation = useDeleteService();
  const [currentImage, setCurrentImage] = useState(0);

  const handleDelete = () => {
    if (window.confirm(`Delete service "${data.name}"?`)) {
      deleteServiceMutation.mutate(data._id);
    }
  };

  const nextImage = () => {
    setCurrentImage(prev =>
      prev === data.imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImage(prev =>
      prev === 0 ? data.imageUrls.length - 1 : prev - 1
    );
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-col">
        <div className="h-[200px] w-full mb-4 relative">
          {data?.imageUrls && data.imageUrls.length > 0 && (
            <>
              <img
                src={data.imageUrls[currentImage]}
                alt={data.name}
                className="w-full h-full rounded-lg object-cover"
              />

              {data.imageUrls.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-2 rounded"
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-2 rounded"
                  >
                    ›
                  </button>
                </>
              )}
            </>
          )}

          <Badge variant="absolute">
            Price starts at {formatToPHP(data.priceStartsAt ?? data.rangeMin)}
          </Badge>
        </div>

        <CardTitle>{data?.name || 'Service Title'}</CardTitle>
        <CardDescription className="line-clamp-3">
          {data?.description || 'No description available.'}
        </CardDescription>
      </CardHeader>

      <CardFooter className="flex gap-2 justify-end">
        <Button variant="outline" onClick={handleEdit}>
          <Pencil /> Edit
        </Button>
        <Button variant="destructive" type="button" onClick={handleDelete}>
          <Trash2 /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
}