import { Badge } from '@/components/ui/badge';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/LoadingSpinner';

function AppointmentCard({ data }) {
  return (
    <Card className="@container/card flex-1 p-2">
      <CardHeader className={'p-2'}>
        <div className="flex gap-4 justify-start items-start">
          <div className=" flex-1 flex flex-col">
            <CardDescription>{data?.title || 'Total'}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{data.value}</CardTitle>
          </div>
          <CardDescription>
            <Button className={data.bgColor}>{data?.icon}</Button>
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}

export default AppointmentCard;
