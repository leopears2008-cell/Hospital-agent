const fs = require('fs');
let code = fs.readFileSync('src/components/DoctorDirectory.tsx', 'utf8');

const targetEmpty = `{filteredDoctors.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            <p>No doctors found matching your criteria.</p>
          </div>
        )}`;

const replacementEmpty = `{filteredDoctors.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-xl font-bold text-slate-800 mb-2">No doctors found</p>
            <p className="text-slate-500">Try changing your search or filters to see more results.</p>
          </div>
        )}`;

code = code.replace(targetEmpty, replacementEmpty);
fs.writeFileSync('src/components/DoctorDirectory.tsx', code);
