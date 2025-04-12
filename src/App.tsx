import React, { useState, useEffect, useRef } from 'react'
import { Calendar, Gift, Search, Trash2, UserPlus } from 'lucide-react'

type FamilyMember = {
  id: string
  name: string
  birthdate: string // ISO string: yyyy-mm-dd
  relationship: string
}

function App() {
  const [members, setMembers] = useState<FamilyMember[]>([])
  const [name, setName] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [relationship, setRelationship] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const isInitialMount = useRef(true)

  // Load data on mount
  useEffect(() => {
    const saved = localStorage.getItem('familyMembers')
    if (saved) {
      setMembers(JSON.parse(saved))
    }
  }, [])

  // Save to localStorage when members change (skip first render)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    localStorage.setItem('familyMembers', JSON.stringify(members))
  }, [members])

  const addMember = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !birthdate || !relationship) return

    const newMember: FamilyMember = {
      id: crypto.randomUUID(),
      name,
      birthdate,
      relationship,
    }

    setMembers(prev => [...prev, newMember])
    setName('')
    setBirthdate('')
    setRelationship('')
  }

  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(member => member.id !== id))
  }

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.relationship.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getBirthdayInfo = (birthdate: string) => {
    const today = new Date()
    const birthdayDate = new Date(birthdate)

    const thisYearBirthday = new Date(
      today.getFullYear(),
      birthdayDate.getMonth(),
      birthdayDate.getDate()
    )

    if (
      thisYearBirthday.getMonth() === today.getMonth() &&
      thisYearBirthday.getDate() === today.getDate()
    ) {
      const age = today.getFullYear() - birthdayDate.getFullYear()
      return { daysUntil: 0, message: `🎉 Happy Birthday! Turning ${age} today!` }
    }

    if (thisYearBirthday < today) {
      thisYearBirthday.setFullYear(today.getFullYear() + 1)
    }

    const diffTime = thisYearBirthday.getTime() - today.getTime()
    const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const age = thisYearBirthday.getFullYear() - birthdayDate.getFullYear()

    return { daysUntil, message: `${daysUntil} day(s) away – turning ${age}` }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800 mb-2 flex items-center justify-center gap-2">
            <Calendar className="h-8 w-8" />
            Deeday
          </h1>
          <p className="text-gray-600">Never miss a special day again!</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Add Member Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-purple-600" />
              Add Family Member
            </h2>
            <form onSubmit={addMember} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Birthday</label>
                <input
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Relationship</label>
                <input
                  type="text"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Sister, Brother, Mom"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-200"
              >
                Add Member
              </button>
            </form>
          </div>

          {/* Birthday List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Gift className="h-5 w-5 text-purple-600" />
                Birthday List
              </h2>
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {filteredMembers.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No birthdays added yet</p>
              ) : (
                filteredMembers.map(member => {
                  const { message } = getBirthdayInfo(member.birthdate)

                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-800">{member.name}</h3>
                        <p className="text-gray-600 text-sm">{member.relationship}</p>
                        <p className="text-purple-600 text-sm">
                          {new Date(member.birthdate).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric'
                          })}{' '}
                          – {message}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteMember(member.id)}
                        className="text-red-500 hover:text-red-700 transition duration-200"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-cyan-900 text-white py-4 mt-12 text-center rounded-t-lg shadow-inner">
        <p className="text-sm">
          © {new Date().getFullYear()} Deeday. All rights reserved.
        </p>
        <p className="text-xs mt-1 text-purple-200">
          Last modified: {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </footer>

    </div>
  )
}

export default App
