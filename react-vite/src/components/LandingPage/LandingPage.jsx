import './LandingPage.css';
import SignupFormModal from "../SignupFormModal";
import OpenModalButton from '../OpenModalButton';
import { useSelector } from 'react-redux';

const LandingPage = () => {
  const user = useSelector(state => state.session.user);

  return (
    <div className="landing-page-container">
     <img className='logo' src="/FullLogo_Transparent_NoBuffer.png" alt="" />
      <h2 className='landing-page-details'>
        Take control of your finances. Our platform helps you effortlessly manage shared expenses, ensuring that everyone pays their fair share. Say goodbye to awkward money conversations and hello to transparency and peace of mind.
      </h2>
      {!user && (
        <OpenModalButton
          buttonText="Get Started"
          modalComponent={<SignupFormModal />}
          className="cta-button"
        />
      )}
    </div>
  );
}

export default LandingPage;
