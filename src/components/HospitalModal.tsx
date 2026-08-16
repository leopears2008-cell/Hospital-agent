import { useState, FormEvent, useEffect } from 'react';
import { X, Phone, MapPin, Bed, Star, ShieldAlert, CheckCircle, ExternalLink, Heart, MessageSquare, Send, User as UserIcon, Calendar, ShieldCheck, Award } from 'lucide-react';
import { Hospital, User, Review } from '../types';
import { AppointmentModal } from './AppointmentModal';

interface HospitalModalProps {
  hospital: Hospital;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (hospital: Hospital) => void;
  currentUser: User | null;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export function HospitalModal({ hospital, onClose, isSaved, onToggleSave, currentUser, onOpenAuth }: HospitalModalProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('tn_health_reviews');
      if (stored) {
        const allReviews: Review[] = JSON.parse(stored);
        setReviews(allReviews.filter(r => r.hospitalId === hospital.id));
      }
    } catch {
      setReviews([]);
    }
  }, [hospital.id]);

  // Calculate average rating including user reviews if any
  const totalRatingSum = reviews.reduce((acc, r) => acc + r.rating, hospital.rating);
  const totalRatingCount = reviews.length + 1;
  const currentAvgRating = (totalRatingSum / totalRatingCount).toFixed(1);

  const handleAddReview = (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newComment.trim()) return;

    setSubmitting(true);
    const newReview: Review = {
      id: Date.now().toString(),
      hospitalId: hospital.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      rating: newRating,
      comment: newComment.trim(),
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    try {
      const stored = localStorage.getItem('tn_health_reviews');
      const allReviews: Review[] = stored ? JSON.parse(stored) : [];
      const updatedAll = [newReview, ...allReviews];
      localStorage.setItem('tn_health_reviews', JSON.stringify(updatedAll));
      setReviews(prev => [newReview, ...prev]);
      setNewComment('');
      setNewRating(5);
    } catch (err: any) {
      console.error("Submit review error:", err.message || err);
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappTarget = hospital.whatsappNumber || hospital.contactNumber;
  const whatsappClean = whatsappTarget.replace(/\D/g, '');
  const whatsappFinal = whatsappClean.length === 10 ? '91' + whatsappClean : whatsappClean;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors text-slate-300 hover:text-white z-10"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-2 flex-wrap relative z-10">
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              hospital.type === 'Government' ? 'bg-blue-100 text-blue-700' :
              hospital.type === 'Trust/Charitable' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}>
              {hospital.type}
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded font-medium relative z-10">
              {hospital.cityOrDistrict}
            </span>
            {hospital.emergencyAvailable && (
              <span className="text-[10px] bg-green-900/50 text-green-300 border border-green-700 px-2.5 py-0.5 rounded font-bold uppercase relative z-10">
                Open 24/7
              </span>
            )}
          </div>

          <h2 className="text-xl font-bold mb-1 relative z-10 flex items-center gap-2 flex-wrap">
            {hospital.name}
            {hospital.verified && (
              <ShieldCheck className="w-5 h-5 text-blue-400" title="Verified Hospital" />
            )}
            {hospital.centerOfExcellence && (
              <Award className="w-5 h-5 text-amber-400" title="Center of Excellence" />
            )}
          </h2>
          <p className="text-xs text-slate-400 flex items-center gap-1 relative z-10">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>{hospital.address}</span>
          </p>
        </div>

        {/* Image Gallery */}
        <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar shrink-0 border-b border-slate-200">
          {(hospital.images && hospital.images.length > 0
            ? hospital.images
            : [
                `https://picsum.photos/seed/${hospital.id}-1/800/400`,
                `https://picsum.photos/seed/${hospital.id}-2/800/400`,
                `https://picsum.photos/seed/${hospital.id}-3/800/400`
              ]
          ).map((imgUrl, idx) => (
            <img
              key={idx}
              src={imgUrl}
              alt={`${hospital.name} view ${idx + 1}`}
              referrerPolicy="no-referrer"
              className="w-full h-48 md:h-64 object-cover shrink-0 snap-center"
            />
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 font-sans">
          {/* Key metrics */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded border border-slate-200 text-center">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Rating</span>
              <span className="text-base font-bold text-slate-900 flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {currentAvgRating} <span className="text-xs text-slate-400 font-normal">({totalRatingCount})</span>
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Beds</span>
              <span className="text-base font-bold text-slate-900 flex items-center justify-center gap-1">
                <Bed className="w-4 h-4 text-blue-600" /> {hospital.bedCapacity}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Specialty</span>
              <span className="text-xs font-bold text-slate-800 line-clamp-1">{hospital.specialty}</span>
            </div>
          </div>

          {/* Occupancy Indicator */}
          {hospital.currentOccupancyRate !== undefined && (
            <div className="bg-slate-50 p-4 rounded border border-slate-200">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2">
                <span className="text-slate-500">Live Facility Occupancy</span>
                <span className={
                  hospital.currentOccupancyRate > 85 ? 'text-rose-600' : 
                  hospital.currentOccupancyRate > 65 ? 'text-amber-600' : 'text-emerald-600'
                }>
                  {hospital.currentOccupancyRate > 85 ? 'High / Busy' : 
                   hospital.currentOccupancyRate > 65 ? 'Moderate' : 'Low / Available'} ({hospital.currentOccupancyRate}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden border border-slate-300/50">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${
                    hospital.currentOccupancyRate > 85 ? 'bg-rose-500' : 
                    hospital.currentOccupancyRate > 65 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${hospital.currentOccupancyRate}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 text-right">Estimated relative to total bed capacity</p>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">About Hospital</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{hospital.description}</p>
          </div>

          {/* Facilities */}
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Key Facilities & Services</h3>
            <div className="flex flex-wrap gap-1.5">
              {hospital.facilities.map((fac, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded font-medium flex items-center gap-1.5 border border-slate-200">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600" /> {fac}
                </span>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" /> Patient Reviews & Comments ({reviews.length})
            </h3>

            {/* Review submission or prompt */}
            {currentUser ? (
              <form onSubmit={handleAddReview} className="bg-slate-50 p-4 rounded border border-slate-200 mb-6 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Leave a Review as {currentUser.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-600">Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="p-1 focus:outline-none"
                      >
                        <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  rows={2}
                  placeholder="Share your experience with care quality, waiting time, or doctors..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded text-xs text-slate-900 focus:border-blue-500 outline-none resize-none"
                  required
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Review
                </button>
              </form>
            ) : (
              <div className="bg-slate-50 p-4 rounded border border-slate-200 mb-6 text-center">
                <p className="text-xs text-slate-600 mb-2">Please login or sign up to leave a rating and comment.</p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onOpenAuth('login')}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => onOpenAuth('signup')}
                    className="px-3 py-1.5 border border-slate-200 rounded text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            )}

            {/* List of reviews */}
            <div className="space-y-3">
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No reviews yet. Be the first to review this hospital!</p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="bg-white p-3.5 rounded border border-slate-200 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs">
                          {rev.userName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs font-bold text-slate-900">{rev.userName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex items-center text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="ml-1 text-xs font-bold text-slate-800">{rev.rating}.0</span>
                        </div>
                        <span className="text-[10px] text-slate-400 ml-2">{rev.createdAt}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 pl-8">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => setShowAppointmentModal(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Calendar className="w-5 h-5" /> Book Appointment
            </button>
            <div className="flex items-center gap-3">
              <a
                href={`tel:${hospital.contactNumber}`}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-2 rounded text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Phone className="w-4 h-4" /> Call
              </a>

              <a
                href={`https://wa.me/${whatsappFinal}?text=${encodeURIComponent('Hello ' + hospital.name + ', I would like to inquire about booking an appointment.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 px-2 rounded text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageSquare className="w-4 h-4" /> WhatsApp
              </a>

              <button
                onClick={() => onToggleSave(hospital)}
                className={`p-2.5 rounded border transition-colors flex items-center justify-center ${
                  isSaved ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title={isSaved ? 'Saved to Favorites' : 'Save Hospital'}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
              </button>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.name + ' ' + hospital.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 px-2 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> Directions
              </a>
            </div>
          </div>
        </div>
      </div>

      {showAppointmentModal && (
        <AppointmentModal
          hospital={hospital}
          currentUser={currentUser}
          onClose={() => setShowAppointmentModal(false)}
          onOpenAuth={onOpenAuth}
        />
      )}
    </div>
  );
}
