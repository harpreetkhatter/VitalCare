"use client"
import React, { useState, useEffect } from 'react'
import { useUser, useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Camera, User, Mail, Calendar, Activity, Heart, Scale, Ruler, LogOut, Plus, X } from 'lucide-react'
import { useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import axios from 'axios'
import { toast } from 'sonner'

interface ProfileData {
  dateOfBirth: string
  gender: string
  conditions: string[]
  allergies: string[]
  height: string
  weight: string
}

const Profile = () => {
  const { user } = useUser()
  const { has } = useAuth()
  const { signOut } = useClerk()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'personal' | 'medical' | 'billing'>('personal')
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const isPro = has ? has({ plan: "pro" }) : false

  // Form state
  const [profileData, setProfileData] = useState<ProfileData>({
    dateOfBirth: '',
    gender: 'Male',
    conditions: [],
    allergies: [],
    height: '',
    weight: ''
  })

  // Temporary inputs for adding conditions/allergies
  const [newCondition, setNewCondition] = useState('')
  const [newAllergy, setNewAllergy] = useState('')

  // Fetch profile data on mount
  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/user-profile')
      if (response.data.profile) {
        setProfileData({
          dateOfBirth: response.data.profile.dateOfBirth || '',
          gender: response.data.profile.gender || 'Male',
          conditions: response.data.profile.conditions || [],
          allergies: response.data.profile.allergies || [],
          height: response.data.profile.height || '',
          weight: response.data.profile.weight || ''
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await axios.post('/api/user-profile', profileData)
      toast.success(response.data.message || 'Profile saved successfully!')
      setIsEditing(false)
      fetchProfile()
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  const handleDiscard = () => {
    fetchProfile()
    setIsEditing(false)
    toast.info('Changes discarded')
  }

  const addCondition = () => {
    if (newCondition.trim()) {
      setProfileData(prev => ({
        ...prev,
        conditions: [...prev.conditions, newCondition.trim()]
      }))
      setNewCondition('')
    }
  }

  const removeCondition = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }))
  }

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setProfileData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }))
      setNewAllergy('')
    }
  }

  const removeAllergy = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }))
  }

  const handleSignOut = () => {
    signOut(() => router.push('/'))
  }

  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'medical', label: 'Medical', icon: Activity },
    { id: 'billing', label: 'Billing', icon: Heart }
  ]

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      {/* Header */}
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-gray-900'>My Profile</h1>
        <p className='text-gray-600 mt-2'>Manage your personal information and preferences</p>
      </div>

      {/* Profile Card */}
      <div className='bg-white rounded-3xl border-2 border-gray-100 p-8'>
        {/* Avatar Section */}
        <div className='flex flex-col items-center mb-8'>
          <div className='relative'>
            <div className='w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center overflow-hidden'>
              {user?.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt={user.fullName || 'User'}
                  width={96}
                  height={96}
                  className='w-full h-full object-cover'
                />
              ) : (
                <User className='w-12 h-12 text-white' />
              )}
            </div>
            <button className='absolute bottom-0 right-0 w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center border-4 border-white hover:bg-teal-700 transition-colors'>
              <Camera className='w-4 h-4 text-white' />
            </button>
          </div>
          <h2 className='text-2xl font-bold text-gray-900 mt-4'>
            {user?.fullName || user?.firstName || 'User'}
          </h2>
          <p className='text-gray-500 text-sm mt-1'>{isPro ? 'Premium Member' : 'Free Member'}</p>
        </div>

        {/* Tabs */}
        <div className='flex gap-2 mb-8 bg-gray-50 p-1 rounded-2xl'>
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${activeTab === tab.id
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <Icon className='w-4 h-4' />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className='space-y-6'>
          {/* Personal Tab */}
          {activeTab === 'personal' && (
            <div className='space-y-6'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-sm font-semibold text-gray-500 uppercase tracking-wide'>
                  Personal Information
                </h3>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="link"
                    className='text-teal-600 hover:text-teal-700 p-0 h-auto text-sm font-semibold'
                  >
                    Edit
                  </Button>
                )}
              </div>
              <div className='space-y-4'>
                <div>
                  <label className='text-sm text-gray-600 mb-2 block'>Full Name</label>
                  <div className='flex items-center gap-3 bg-gray-50 rounded-xl p-4 border-2 border-gray-100'>
                    <User className='w-5 h-5 text-gray-400' />
                    <input
                      type='text'
                      value={user?.fullName || ''}
                      readOnly
                      className='flex-1 bg-transparent outline-none text-gray-900 font-medium'
                    />
                  </div>
                </div>

                <div>
                  <label className='text-sm text-gray-600 mb-2 block'>Email Address</label>
                  <div className='flex items-center gap-3 bg-gray-50 rounded-xl p-4 border-2 border-gray-100'>
                    <Mail className='w-5 h-5 text-gray-400' />
                    <input
                      type='email'
                      value={user?.primaryEmailAddress?.emailAddress || ''}
                      readOnly
                      className='flex-1 bg-transparent outline-none text-gray-900 font-medium'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='text-sm text-gray-600 mb-2 block'>Date of Birth</label>
                    <div className='flex items-center gap-3 bg-gray-50 rounded-xl p-4 border-2 border-gray-100'>
                      <Calendar className='w-5 h-5 text-gray-400' />
                      <input
                        type='date'
                        value={profileData.dateOfBirth}
                        onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                        disabled={!isEditing}
                        className='flex-1 bg-transparent outline-none text-gray-900 font-medium disabled:cursor-not-allowed'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='text-sm text-gray-600 mb-2 block'>Gender</label>
                    <div className='flex items-center gap-3 bg-gray-50 rounded-xl p-4 border-2 border-gray-100'>
                      <select
                        value={profileData.gender}
                        onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                        disabled={!isEditing}
                        className='flex-1 bg-transparent outline-none text-gray-900 font-medium disabled:cursor-not-allowed'
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Medical Tab */}
          {activeTab === 'medical' && (
            <div className='space-y-6'>
              <div>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-sm font-semibold text-gray-500 uppercase tracking-wide'>
                    Medical History
                  </h3>
                  {!isEditing && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="link"
                      className='text-teal-600 hover:text-teal-700 p-0 h-auto text-sm font-semibold'
                    >
                      Edit
                    </Button>
                  )}
                </div>

                <div className='space-y-4'>
                  <div>
                    <label className='text-sm text-gray-600 mb-3 block font-medium'>Chronic Conditions</label>
                    <div className='flex flex-wrap gap-2 mb-3'>
                      {profileData.conditions.map((condition, i) => (
                        <span
                          key={i}
                          className='bg-red-50 text-red-700 px-4 py-2 rounded-xl text-sm font-medium border border-red-200 flex items-center gap-2'
                        >
                          {condition}
                          {isEditing && (
                            <button onClick={() => removeCondition(i)} className='hover:text-red-900'>
                              <X className='w-3 h-3' />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                    {isEditing && (
                      <div className='flex gap-2'>
                        <input
                          type='text'
                          value={newCondition}
                          onChange={(e) => setNewCondition(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addCondition()}
                          placeholder='Add condition...'
                          className='flex-1 bg-gray-50 px-4 py-2 rounded-xl text-sm border-2 border-gray-200 outline-none focus:border-teal-500'
                        />
                        <Button onClick={addCondition} className='bg-teal-600 hover:bg-teal-700 rounded-xl'>
                          <Plus className='w-4 h-4' />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className='text-sm text-gray-600 mb-3 block font-medium'>Known Allergies</label>
                    <div className='flex flex-wrap gap-2 mb-3'>
                      {profileData.allergies.map((allergy, i) => (
                        <span
                          key={i}
                          className='bg-orange-50 text-orange-700 px-4 py-2 rounded-xl text-sm font-medium border border-orange-200 flex items-center gap-2'
                        >
                          {allergy}
                          {isEditing && (
                            <button onClick={() => removeAllergy(i)} className='hover:text-orange-900'>
                              <X className='w-3 h-3' />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                    {isEditing && (
                      <div className='flex gap-2'>
                        <input
                          type='text'
                          value={newAllergy}
                          onChange={(e) => setNewAllergy(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
                          placeholder='Add allergy...'
                          className='flex-1 bg-gray-50 px-4 py-2 rounded-xl text-sm border-2 border-gray-200 outline-none focus:border-teal-500'
                        />
                        <Button onClick={addAllergy} className='bg-teal-600 hover:bg-teal-700 rounded-xl'>
                          <Plus className='w-4 h-4' />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4'>
                  Health Details
                </h3>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='bg-blue-50 rounded-2xl p-6 border-2 border-blue-100'>
                    <div className='flex items-center gap-3 mb-2'>
                      <div className='w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center'>
                        <Ruler className='w-5 h-5 text-white' />
                      </div>
                      <span className='text-sm text-blue-600 font-semibold'>Height</span>
                    </div>
                    <input
                      type='text'
                      value={profileData.height}
                      onChange={(e) => setProfileData({ ...profileData, height: e.target.value })}
                      disabled={!isEditing}
                      placeholder='e.g., 182 cm'
                      className='text-3xl font-bold text-gray-900 bg-transparent outline-none w-full disabled:cursor-not-allowed'
                    />
                  </div>

                  <div className='bg-purple-50 rounded-2xl p-6 border-2 border-purple-100'>
                    <div className='flex items-center gap-3 mb-2'>
                      <div className='w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center'>
                        <Scale className='w-5 h-5 text-white' />
                      </div>
                      <span className='text-sm text-purple-600 font-semibold'>Weight</span>
                    </div>
                    <input
                      type='text'
                      value={profileData.weight}
                      onChange={(e) => setProfileData({ ...profileData, weight: e.target.value })}
                      disabled={!isEditing}
                      placeholder='e.g., 78 kg'
                      className='text-3xl font-bold text-gray-900 bg-transparent outline-none w-full disabled:cursor-not-allowed'
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className='space-y-6'>
              <div>
                <h3 className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4'>
                  Current Plan
                </h3>
                <div className={`rounded-2xl p-6 border-2 ${isPro
                    ? 'bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200'
                    : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
                  }`}>
                  <div className='flex items-center justify-between mb-4'>
                    <div>
                      <h4 className='text-2xl font-bold text-gray-900'>{isPro ? 'Premium Plan' : 'Free Plan'}</h4>
                      <p className='text-gray-600 mt-1'>
                        {isPro ? 'Unlimited consultations & features' : '1 consultation per month'}
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className={`text-3xl font-bold ${isPro ? 'text-teal-600' : 'text-gray-900'}`}>
                        {isPro ? '$29' : '$0'}
                      </p>
                      <p className='text-sm text-gray-600'>{isPro ? 'per month' : 'forever'}</p>
                    </div>
                  </div>
                  <div className='flex gap-3'>
                    <Button
                      onClick={() => router.push('/dashboard/billing')}
                      className={`flex-1 rounded-xl ${isPro
                          ? 'bg-teal-600 hover:bg-teal-700 text-white'
                          : 'bg-gray-900 hover:bg-gray-800 text-white'
                        }`}
                    >
                      {isPro ? 'Manage Plan' : 'Upgrade to Premium'}
                    </Button>
                    {isPro && (
                      <Button variant="outline" className='flex-1 border-2 border-gray-300 rounded-xl'>
                        Cancel Plan
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {isPro && (
                <div>
                  <h3 className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4'>
                    Payment Method
                  </h3>
                  <div className='bg-gray-50 rounded-2xl p-6 border-2 border-gray-100'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center'>
                          <span className='text-white font-bold text-sm'>VISA</span>
                        </div>
                        <div>
                          <p className='font-semibold text-gray-900'>•••• •••• •••• 4242</p>
                          <p className='text-sm text-gray-500'>Expires 12/25</p>
                        </div>
                      </div>
                      <Button variant="link" className='text-teal-600 hover:text-teal-700 p-0 h-auto font-semibold'>
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className='flex gap-3 mt-8 pt-8 border-t-2 border-gray-100'>
            <Button
              onClick={handleSave}
              disabled={loading}
              className='flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-xl py-6 font-semibold'
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              onClick={handleDiscard}
              disabled={loading}
              variant="outline"
              className='flex-1 border-2 border-gray-300 rounded-xl py-6 font-semibold'
            >
              Discard Changes
            </Button>
          </div>
        )}

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className='w-full mt-4 flex items-center justify-center gap-2 text-red-600 hover:text-red-700 py-4 rounded-xl hover:bg-red-50 transition-colors font-semibold'
        >
          <LogOut className='w-5 h-5' />
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default Profile
