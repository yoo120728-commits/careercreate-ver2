'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabaseへの接続準備
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [careerName, setCareerName] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 「保存」ボタンが押された時の処理
  const handleCreateCareer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!careerName.trim()) return;

    setIsLoading(true);
    setMessage('');

    try {
      // Supabaseにセーブデータを保存
      const { data, error } = await supabase
        .from('saves')
        .insert([{ name: careerName }])
        .select();

      if (error) throw error;

      setMessage(`🎉 キャリア「${careerName}」を作成しました！`);
      setCareerName('');
    } catch (err: any) {
      setMessage(`❌ エラーが発生しました: ${err.message || '作成に失敗しました'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>⚽ FC26 Realistic Simulator</h1>
      <p style={{ color: '#666' }}>リアリスティック・キャリアモード シミュレーター</p>

      <hr style={{ margin: '20px 0' }} />

      <h2>新しいキャリアを作成</h2>
      
      <form onSubmit={handleCreateCareer} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            キャリア名（監督名やクラブ名など）:
          </label>
          <input
            type="text"
            value={careerName}
            onChange={(e) => setCareerName(e.target.value)}
            placeholder="例: シャルケ 2026 シーズン"
            style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !careerName.trim()}
          style={{
            padding: '12px',
            fontSize: '16px',
            backgroundColor: isLoading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isLoading ? '作成中...' : '新しいキャリアを作成'}
        </button>
      </form>

      {message && (
        <div style={{ marginTop: '20px', padding: '15px', borderRadius: '4px', backgroundColor: '#f0f0f0' }}>
          {message}
        </div>
      )}
    </main>
  );
}
