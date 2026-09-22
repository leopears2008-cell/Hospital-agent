import React, { useState } from 'react';
import { Search, FileText, Loader2, Hospital, Building2 } from 'lucide-react';
import { Hospital as HospitalType } from '../types';

interface SearchResult {
  id: number;
  documentId: string;
  documentType: string;
  content: string;
  metadata: any;
  similarity: number;
}

export default function DocumentSearch({ hospitals }: { hospitals: HospitalType[] }) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState('');
  
  // Filters
  const [documentType, setDocumentType] = useState('');
  const [hospitalId, setHospitalId] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setError('');

    try {
      const response = await fetch('/api/semantic-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          topK: 5,
          documentType: documentType || undefined,
          hospitalId: hospitalId || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to perform search');
      }

      const data = await response.json();
      setResults(data.results || []);
    } catch (err: any) {
      console.error(err);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const getHospitalName = (id: string) => {
    return hospitals.find(h => h.id === id)?.name || 'Unknown Hospital';
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          Semantic Document Search
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Search across hospital policies, doctor guidelines, and medical protocols using AI-powered semantic search.
        </p>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. 'What is the policy for emergency admissions?'"
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-slate-700"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-600 mb-1">Document Type</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700 bg-white"
              >
                <option value="">All Types</option>
                <option value="policy">Hospital Policy</option>
                <option value="guideline">Medical Guideline</option>
                <option value="faq">FAQ</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-600 mb-1">Hospital Filter</label>
              <select
                value={hospitalId}
                onChange={(e) => setHospitalId(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700 bg-white"
              >
                <option value="">All Hospitals</option>
                {hospitals.map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {isSearching ? 'Searching...' : 'Search Documents'}
            </button>
          </div>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
        {error && (
          <div className="p-4 bg-rose-50 text-rose-700 rounded-xl mb-4 text-sm font-medium">
            {error}
          </div>
        )}

        {!isSearching && results.length === 0 && !error && query && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-1">No matches found</h3>
            <p className="text-sm text-slate-500">Try rephrasing your search query or removing filters.</p>
          </div>
        )}

        <div className="space-y-4">
          {results.map((result, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded uppercase tracking-wide">
                    {result.documentType || 'Document'}
                  </span>
                  {result.metadata?.hospital_id && (
                    <span className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
                      <Hospital className="w-3 h-3" />
                      {getHospitalName(result.metadata.hospital_id)}
                    </span>
                  )}
                  {result.metadata?.department && (
                    <span className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
                      <Building2 className="w-3 h-3" />
                      {result.metadata.department}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded">
                  {(result.similarity * 100).toFixed(1)}% Match
                </div>
              </div>
              
              <div className="prose prose-sm max-w-none text-slate-700">
                <p className="whitespace-pre-wrap">{result.content}</p>
              </div>
              
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Doc ID: {result.documentId}</span>
                {result.metadata?.updated_at && (
                  <span>Updated: {new Date(result.metadata.updated_at).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
