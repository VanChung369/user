import { useEffect, useState } from "react";
import moment from "moment";

export const useChangeDate = () => {
  const [errorStartDate, setErrorStartDate] = useState(false);
  const [errorEndDate, setErrorEndDate] = useState(false);
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();

  useEffect(() => {
    if (endDate) {
      if (moment(startDate).isSameOrBefore(moment(endDate))) {
        if (moment(endDate).isSameOrAfter(moment(startDate))) {
          setErrorEndDate(false);
        }
        return setErrorStartDate(false);
      }
      return setErrorStartDate(true);
    }

    return setErrorStartDate(false);
  }, [startDate]);

  useEffect(() => {
    if (startDate) {
      if (moment(endDate).isSameOrAfter(moment(startDate))) {
        if (moment(startDate).isSameOrBefore(moment(endDate))) {
          setErrorStartDate(false);
        }
        return setErrorEndDate(false);
      }
      return setErrorEndDate(true);
    }

    return setErrorEndDate(false);
  }, [endDate]);

  return {
    errorStartDate,
    errorEndDate,
    setErrorStartDate,
    setErrorEndDate,
    setStartDate,
    setEndDate,
  };
};
