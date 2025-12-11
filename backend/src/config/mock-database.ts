// Mock database for development when no database is available
export const mockDatabase = {
  users: [
    { id: 1, email: 'test@example.com', password: '$2a$10$example', created_at: new Date() }
  ],
  health_records: [] as any[]
};

export const mockPool = {
  query: async (text: string, params?: any[]) => {
    console.log('🔧 Mock database query:', text.substring(0, 50) + '...');
    
    // Mock responses for different queries
    if (text.includes('SELECT NOW()')) {
      return { rows: [{ now: new Date() }] };
    }
    
    if (text.includes('SELECT * FROM users WHERE email')) {
      const email = params?.[0];
      const user = mockDatabase.users.find(u => u.email === email);
      return { rows: user ? [user] : [] };
    }
    
    if (text.includes('INSERT INTO users')) {
      const newUser = {
        id: mockDatabase.users.length + 1,
        email: params?.[0],
        password: params?.[1],
        created_at: new Date()
      };
      mockDatabase.users.push(newUser);
      return { rows: [{ id: newUser.id, email: newUser.email, created_at: newUser.created_at }] };
    }
    
    if (text.includes('INSERT INTO health_records')) {
      const newRecord = {
        id: mockDatabase.health_records.length + 1,
        user_id: params?.[0],
        record_date: params?.[1],
        record_time: params?.[2],
        site: params?.[3],
        onset: params?.[4],
        character: params?.[5],
        radiation: params?.[6],
        associations: params?.[7],
        time_course: params?.[8],
        exacerbating_factors: params?.[9],
        severity: params?.[10],
        palliating_factors: params?.[11],
        quality: params?.[12],
        region: params?.[13],
        symptoms: params?.[14],
        medications: params?.[15],
        diet_notes: params?.[16],
        vital_signs: params?.[17],
        personal_notes: params?.[18],
        created_at: new Date(),
        updated_at: new Date()
      };
      mockDatabase.health_records.push(newRecord);
      return { rows: [newRecord] };
    }
    
    if (text.includes('SELECT * FROM health_records WHERE id')) {
      const recordId = params?.[0];
      const userId = params?.[1];
      const record = mockDatabase.health_records.find(r => r.id === recordId && r.user_id === userId);
      return { rows: record ? [record] : [] };
    }
    
    if (text.includes('SELECT * FROM health_records WHERE user_id')) {
      const userId = params?.[0];
      const records = mockDatabase.health_records.filter(r => r.user_id === userId);
      return { rows: records };
    }
    
    if (text.includes('UPDATE health_records SET ai_analysis')) {
      const analysis = params?.[0];
      const recordId = params?.[1];
      const record = mockDatabase.health_records.find(r => r.id === recordId);
      if (record) {
        record.ai_analysis = analysis;
        record.updated_at = new Date();
      }
      return { rows: [] };
    }
    
    if (text.includes('health_records')) {
      return { rows: mockDatabase.health_records };
    }
    
    return { rows: [] };
  },
  
  connect: async () => ({
    query: mockPool.query,
    release: () => {}
  }),
  
  // Mock event emitter methods
  on: (event: string, callback: Function) => {
    if (event === 'connect') {
      setTimeout(() => callback(), 100);
    }
  },
  
  end: async () => {
    console.log('🔧 Mock database connection closed');
  }
};