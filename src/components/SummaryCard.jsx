import { Badge } from '@/components/ui/badge';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Link, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/LoadingSpinner';
import { NavLink } from 'react-router-dom';

function SummaryCard({ data }) {
  return (
    <Card className="@container/card flex-1 p-4">
      <CardHeader className={'p-2'}>
        <div className="h-16 flex gap-4 justify-start items-start">
          <div className="h-full flex-1 flex flex-col  justify-between">
            <CardDescription>{data?.title || 'Total'}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{data.value}</CardTitle>
          </div>
          <div className="h-full flex flex-col justify-between place-items-end">
            <Button className={data.bgColor}>{data?.icon}</Button>
            {data.url && (
              <NavLink to={data.url}>
                <ExternalLink size={16} />
              </NavLink>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

export default SummaryCard;
