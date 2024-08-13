import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {fetchBalance} from '../../redux/balance';
import './Balances.css';

const Balances = () => {
  const dispatch = useDispatch();
  const balance = useSelector((state) => state.balances.balance);

  useEffect(() => {
    dispatch(fetchBalance());
  }, [dispatch]);

  return (
    <div className="balances-container">
      <div className="balances-card">
        <h2>My Balance</h2>
        {balance && (
          <>
            <p>Total Paid: ${balance.total_paid.toFixed(2)}</p>
            <p>Total Owed: ${balance.total_owed.toFixed(2)}</p>
            <h3>Net Balance: ${balance.net_balance.toFixed(2)}</h3>
          </>
        )}
      </div>
    </div>
  );
}

export default Balances;
