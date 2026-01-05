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

export function ServiceCard({ data, handleEdit, handleDelete }) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-col">
        <div className="h-[200px] w-full mb-4 relative">
          {data?.imageUrl && (
            <img
              src={data.imageUrl}
              alt={data.name}
              className="w-full h-full rounded-lg object-cover"
            />
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
        <Button variant="destructive" onClick={handleDelete}>
          <Trash2 />
        </Button>
      </CardFooter>
    </Card>
  );
}
