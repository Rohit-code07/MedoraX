import React, { useState } from 'react';
import { updateProfile as apiUpdateProfile } from '../api/profile.api';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Heart, 
  PhoneCall, 
  Smartphone, 
  Info,
  Edit2,
  CheckCircle,
  Clock,
  Activity,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import toast from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const { profile, updateProfile } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [bloodType, setBloodType] = useState(profile.bloodType);
  const [height, setHeight] = useState(profile.height);
  const [weight, setWeight] = useState(profile.weight);
  const [emergencyName, setEmergencyName] = useState(profile.emergencyContact.name);
  const [emergencyRelation, setEmergencyRelation] = useState(profile.emergencyContact.relationship);
  const [emergencyPhone, setEmergencyPhone] = useState(profile.emergencyContact.phone);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const profileData = {
      name,
      bloodType,
      height,
      weight,
      emergencyContact: {
        name: emergencyName,
        relationship: emergencyRelation,
        phone: emergencyPhone,
      }
    };

    updateProfile(profileData);
    setIsEditing(false);

    const userId = localStorage.getItem('userId');
    if (userId) {
      try {
        await apiUpdateProfile(userId, profileData);
      } catch (err) {
        console.warn('Backend profile update failed:', err);
      }
    }
    toast.success('Medical profile updated successfully!');
  };

  return (
    <div className="flex flex-col gap-6 text-left max-w-4xl mx-auto">
      
      {/* 1. Header */}
      <div className="flex justify-between items-center select-none">
        <div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">patient card</span>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-zinc-200 mt-1">Personal Medical Profile</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl flex items-center gap-1.5 cursor-pointer text-slate-500 border-slate-200 dark:border-zinc-800"
          onClick={() => setIsEditing(!isEditing)}
          leftIcon={<Edit2 className="w-3.5 h-3.5" />}
        >
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </Button>
      </div>

      {/* 2. Interactive edit form vs display */}
      <form onSubmit={handleSave} className="flex flex-col gap-6">
        
        {/* Profile Card Header */}
        <Card className="border-slate-100 dark:border-zinc-800/80 bg-white dark:bg-[#121214]">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-20 h-20 rounded-[20px] object-cover ring-4 ring-slate-100 dark:ring-zinc-800"
            />
            
            <div className="flex-1 flex flex-col text-center sm:text-left gap-1">
              {isEditing ? (
                <div className="max-w-xs">
                  <Input
                    label="Patient Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-none">{profile.name}</h3>
                  <span className="text-xs text-slate-400 dark:text-zinc-500 mt-1">{profile.email}</span>
                </>
              )}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mt-3 select-none">
                <Badge variant="success" size="sm">Adherence rating: Silver Tier</Badge>
                <Badge variant="primary" size="sm">Emergency alerts active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Medical statistics */}
          <Card className="border-slate-100 dark:border-zinc-800/80 bg-white dark:bg-[#121214]">
            <CardHeader className="pb-3 border-b border-slate-50 dark:border-zinc-800/50">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5 select-none">
                <Heart className="w-4 h-4 text-rose-500" />
                Vitals & Medical Specs
              </CardTitle>
              <CardDescription>Demographic attributes used for clinical dosage calculation</CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex flex-col gap-4">
              {isEditing ? (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Blood Type"
                      value={bloodType}
                      onChange={(e) => setBloodType(e.target.value)}
                      required
                    />
                    <Input
                      label="Allergies (comma separated)"
                      value={profile.allergies.join(', ')}
                      disabled
                      helperText="Contact system admin to update allergies"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Height"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      required
                    />
                    <Input
                      label="Weight"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6 select-none">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Blood Type</span>
                    <span className="text-sm font-extrabold text-slate-700 dark:text-zinc-200 mt-1">{profile.bloodType}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Known Allergies</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profile.allergies.map((a, i) => (
                        <Badge key={i} variant="danger" size="sm">{a}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Height</span>
                    <span className="text-sm font-extrabold text-slate-700 dark:text-zinc-200 mt-1">{profile.height}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Weight</span>
                    <span className="text-sm font-extrabold text-slate-700 dark:text-zinc-200 mt-1">{profile.weight}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="border-slate-100 dark:border-zinc-800/80 bg-white dark:bg-[#121214]">
            <CardHeader className="pb-3 border-b border-slate-50 dark:border-zinc-800/50">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5 select-none">
                <PhoneCall className="w-4 h-4 text-brand-primary" />
                Emergency Contact Guard
              </CardTitle>
              <CardDescription>Primary supervisor contacted when high-priority doses are missed</CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex flex-col gap-4">
              {isEditing ? (
                <div className="flex flex-col gap-4">
                  <Input
                    label="Contact Name"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Relationship"
                      value={emergencyRelation}
                      onChange={(e) => setEmergencyRelation(e.target.value)}
                      required
                    />
                    <Input
                      label="Phone number"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4 select-none">
                  <div className="flex justify-between items-center p-3 bg-slate-50/50 dark:bg-zinc-900/50 rounded-xl border border-slate-100 dark:border-zinc-800/50">
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">{profile.emergencyContact.name}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">{profile.emergencyContact.relationship}</span>
                    </div>
                    <span className="text-xs font-bold text-brand-primary dark:text-brand-secondary">{profile.emergencyContact.phone}</span>
                  </div>
                  <div className="p-3 bg-blue-500/5 text-blue-600 dark:text-blue-400 border border-blue-500/10 rounded-xl flex gap-2.5 items-start">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <p className="text-[10px] leading-relaxed">
                      Escalated SMS triggers will fire to this number if primary alert notification reminders remain unanswered for 30 minutes.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Connected Wearables and Devices */}
        <Card className="border-slate-100 dark:border-zinc-800/80 bg-white dark:bg-[#121214]">
          <CardHeader className="pb-3 border-b border-slate-50 dark:border-zinc-800/50">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5 select-none">
              <Smartphone className="w-4 h-4 text-brand-secondary" />
              Connected Bio-Sensors & Devices
            </CardTitle>
            <CardDescription>External synchronization with health wearables</CardDescription>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profile.connectedDevices.map((device, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/20 dark:bg-zinc-900/10 flex items-center justify-between select-none">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-brand-secondary flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">{device}</span>
                </div>
                <Badge variant="success" size="sm">Connected</Badge>
              </div>
            ))}
            <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 flex items-center justify-center select-none hover:bg-slate-50 dark:hover:bg-zinc-900/10 cursor-pointer">
              <span className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add Smart Device
              </span>
            </div>
          </CardContent>
        </Card>

        {isEditing && (
          <div className="flex justify-end gap-3 select-none">
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              Discard Changes
            </Button>
            <Button type="submit">
              Save Medical Changes
            </Button>
          </div>
        )}

      </form>

    </div>
  );
};
export default ProfilePage;
