import React, { useEffect, useState } from 'react';
import styles from '../../styles/listItems/listItems.module.css';
import { BiSearch } from 'react-icons/bi';
import { LuFilter } from 'react-icons/lu'
import { BsCheckCircleFill, BsFillXCircleFill } from 'react-icons/bs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ListItem, ListProps } from '@/models/items';

const List: React.FC<ListProps> = ({ items }) => {

  //states --------------------------
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [startDateFilter, setStartDateFilter] = useState<Date | null>(null);
  const [endDateFilter, setEndDateFilter] = useState<Date | null>(null);
  const [campaigns, setCampaigns] = useState<ListItem[]>(items); 

  const today = new Date();

  //functions ------------------------

  //this is for determining the status of the item
  const getStatus = (endDate: Date): string => {
    if (endDate < today) {
      return 'Inactive';
    } else {
      return 'Active';
    }
  };

  //i used a single list to show the list when search is done or not.
  const filteredItems = campaigns.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //for handling start date
  const handleStartDateChange = (date: Date | null) => {
    setStartDateFilter(date);
  };

  //for handling end date
  const handleEndDateChange = (date: Date | null) => {
    setEndDateFilter(date);
  };

  //for filtering the list according to starting or ending dates
  const isItemWithinDateRange = (item: ListItem) => {
    if (startDateFilter && endDateFilter) {
      return (
        item.startDate >= startDateFilter && item.endDate <= endDateFilter
      );
    } else if (startDateFilter) {
      return item.startDate >= startDateFilter;
    } else if (endDateFilter) {
      return item.endDate <= endDateFilter;
    }
    return true;
  };

  //you can add campaigns to test project with this method
  const AddCampaigns = (newCampaigns: ListItem[]) => {
    setCampaigns((prevCampaigns) => [...prevCampaigns, ...newCampaigns]);
  };


  //hooks ---------------------------
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // i assign the AddCampaigns method to the global object so i can use it on Javascript console.
      (window as any).AddCampaigns = AddCampaigns;
    }
  }, []);


  return (
    <div className={styles.listItems}>
      <div className={styles.searchHeader}>
        <div className={styles.containerHeader}>
          <h1>Campaigns</h1>
          <div className={styles.searchBar}>
            <BiSearch size={20} />
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className={styles.listSide}>
        <div className={styles.filter} style={{ width: isFilterOpen ? '100%' : '65px',}}>
          <LuFilter size={25} onClick={() => { setIsFilterOpen(!isFilterOpen) }} />
          {isFilterOpen &&
            <div className={styles.pickers} >
              <div className={styles.datePickerContainer}>
                <DatePicker
                  selected={startDateFilter}
                  onChange={handleStartDateChange}
                  className={styles.datePicker}
                  placeholderText="Select start date"
                  dateFormat="MM/dd/yyyy"
                  maxDate={endDateFilter || undefined}
                />
              </div>
              <div className={styles.datePickerContainer}>
                <DatePicker
                  selected={endDateFilter}
                  onChange={handleEndDateChange}
                  className={styles.datePicker}
                  placeholderText="Select end date"
                  dateFormat="MM/dd/yyyy"
                  minDate={startDateFilter || undefined}
                />
              </div>
              <p onClick={() => { setStartDateFilter(null); setEndDateFilter(null) }}>Clear</p>
            </div>
          }
        </div>
        <div className={styles.campaignList}>
          <div className={styles.headerOfCampaignTable}>
            <p>Name</p>
            <p>Status</p>
            <p>Start Date</p>
            <p>End Date</p>
            <p>Budget</p>
          </div>
          <ul>
            {filteredItems
              .filter(isItemWithinDateRange)
              .map((item, index) => (
                <li key={index}>
                  <p><span>Name</span>{item.name}</p>
                  <p>
                    <span>Status</span>
                    <span className={styles.status}>
                      {getStatus(item.endDate) === 'Inactive' ? (
                        <BsFillXCircleFill color="red" size={15} />
                      ) : (
                        <BsCheckCircleFill color="green" size={15} />
                      )}{' '}
                      {getStatus(item.endDate)}
                    </span>
                  </p>
                  <p><span>Start Date</span>{item.startDate.toLocaleDateString('en-US')}</p>
                  <p><span>End Date</span>{item.endDate.toLocaleDateString('en-US')}</p>
                  <p><span>Budget</span>${item.Budget.toLocaleString()}</p>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default List;