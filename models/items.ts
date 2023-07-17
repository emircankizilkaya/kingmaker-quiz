export interface ListItem {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  Budget: number;
}

export interface ListProps {
  items: ListItem[];
}