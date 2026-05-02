import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuthContext } from '../../hooks/UseAuthContext';

const PetCards = (props) => {
  const [showJustificationPopup, setShowJustificationPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showApproved, setShowApproved] = useState(false);
  const [showDeletedSuccess, setshowDeletedSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [adoptionLikelihood, setAdoptionLikelihood] = useState(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const convertAgeToMonths = (ageString) => {
      const match = ageString.match(/(\d+)/);
      if (!match) return 12;
      
      const number = parseInt(match[1]);
      if (ageString.toLowerCase().includes('year')) {
        return number * 12;
      } else if (ageString.toLowerCase().includes('month')) {
        return number;
      } else if (ageString.toLowerCase().includes('week')) {
        return number * 4;
      }
      return number;
    };

    const fetchAdoptionLikelihood = async () => {
      try {
        const response = await fetch('http://localhost:8000/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            type: props.pet.type,
            breed: props.pet.breed || 'Other',
            AgeMonths: convertAgeToMonths(props.pet.age),
            status: props.pet.status
          })
        });

        if (response.ok) {
          const data = await response.json();
          setAdoptionLikelihood(data.likelihood_percentage / 100 || null);
        }
      } catch (error) {
        console.warn('Could not fetch adoption likelihood:', error);
      }
    };

    // Fetch adoption likelihood when component mounts
    fetchAdoptionLikelihood();
  }, [props.pet]);

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  };

  const maxLength = 40;

  const formatTimeAgo = (updatedAt) => {
    const date = new Date(updatedAt);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/approving/${props.pet._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          status: "Approved"
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      })

      if (!response.ok) {
        setShowErrorPopup(true);
      } else {
        setShowApproved(true);
      }
    } catch (err) {
      setShowErrorPopup(true);
    } finally {
      setIsApproving(false);
    }
  }

  const deleteFormsAdoptedPet = async () => {
    setIsDeleting(true)
    try {
      const deleteResponses = await fetch(`${process.env.REACT_APP_API_URL}/form/delete/many/${props.pet._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (!deleteResponses.ok) {
        throw new Error('Failed to delete forms');
      }
    } catch (err) {
    }finally{
      handleReject();
    }
  }

  const handleReject = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/delete/${props.pet._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })

      if (!response.ok) {
        setShowErrorPopup(true);
        throw new Error('Failed to delete pet');
      } else {
        setshowDeletedSuccess(true);
      }
    } catch (err) {
      setShowErrorPopup(true);
      console.error('Error deleting pet:', err);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className='req-containter'>
      <div className='pet-view-card'>
        <div className='pet-card-pic'>
          <img src={`${process.env.REACT_APP_API_URL}/images/${props.pet.filename}`} alt={props.pet.name} />
        </div>
        <div className='pet-card-details'>
          <h2>{props.pet.name}</h2>
          <p><b>Type:</b> {props.pet.type}</p>
          <p><b>Breed:</b> {props.pet.breed || 'Not specified'}</p>
          <p><b>Age:</b> {props.pet.age}</p>
          <p><b>Location:</b> {props.pet.area}</p>
          {adoptionLikelihood !== null && (
            <p><b>Adoption Likelihood:</b> <span style={{color: '#27ae60', fontWeight: 'bold'}}>{Math.round(adoptionLikelihood * 100)}%</span></p>
          )}
          <p><b>Owner Email:</b> {props.pet.email}</p>
          <p><b>Owner Phone:</b> {props.pet.phone}</p>
          <p>
            <b>Justification:</b>
            <span>
              {truncateText(props.pet.justification, maxLength)}
              {props.pet.justification.length > maxLength && (
                <span onClick={() => setShowJustificationPopup(!showJustificationPopup)} className='read-more-btn'>
                  Read More
                </span>
              )}
            </span>
          </p>
          <p>{formatTimeAgo(props.pet.updatedAt)}</p>
        </div>
        <div className='app-rej-btn'>
          <button onClick={deleteFormsAdoptedPet} disabled={isDeleting || isApproving}>{isDeleting ? (<p>Deleting</p>) : (props.deleteBtnText)}</button>
          {props.approveBtn ?
            <button disabled={isDeleting || isApproving} onClick={handleApprove}>{isApproving ? (<p>Approving</p>) : 'Approve'}</button>
            : ''
          }
        </div>
        {showJustificationPopup && (
          <div className='popup'>
            <div className='popup-content'>
              <h4>Justification:</h4>
              <p>{props.pet.justification}</p>
            </div>
            <button onClick={() => setShowJustificationPopup(!showJustificationPopup)} className='close-btn'>
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}
        {showErrorPopup && (
          <div className='popup'>
            <div className='popup-content'>
              <p>Oops!... Connection Error</p>
            </div>
            <button onClick={() => setShowErrorPopup(!showErrorPopup)} className='close-btn'>
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}
        {showApproved && (
          <div className='popup'>
            <div className='popup-content'>
              <p>Approval Successful...</p>
              <p>
                Please contact the customer at{' '}
                <a href={`mailto:${props.pet.email}`}>{props.pet.email}</a>{' '}
                or{' '}
                <a href={`tel:${props.pet.phone}`}>{props.pet.phone}</a>{' '}
                to arrange the transfer of the pet from the owner's home to our adoption center.
              </p>
            </div>
            <button onClick={() => {
              setShowApproved(!showApproved)
              props.updateCards()
            }} className='close-btn'>
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {showDeletedSuccess && (
          <div className='popup'>
            <div className='popup-content'>
              <p>Deleted Successfully from Database...</p>
            </div>
            <button onClick={() => {
              setshowDeletedSuccess(!showDeletedSuccess)
              props.updateCards()
            }} className='close-btn'>
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default PetCards;
