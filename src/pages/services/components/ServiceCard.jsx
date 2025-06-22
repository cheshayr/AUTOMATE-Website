import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAlert } from '@/hooks/useAlert';
import { Pencil, Trash2 } from 'lucide-react';

export function ServiceCard({ data, handleEdit, handleDelete }) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex-1 flex flex-col ">
        <CardTitle>{data?.name || 'Service Title'}</CardTitle>
        <CardDescription className="line-clamp-3">{data?.description || 'No description available.'}</CardDescription>
      </CardHeader>
      {/* <CardContent></CardContent> */}
      <CardFooter className="flex-row gap-2 place-self-end justify-end">
        <Button type="submit" variant="outline" className="flex-1 cursor-pointer" onClick={handleEdit}>
          <Pencil /> Edit
        </Button>
        <Button variant="destructive" className="flex-1 cursor-pointer" onClick={handleDelete}>
          <Trash2 />
        </Button>
      </CardFooter>
    </Card>
  );
}
