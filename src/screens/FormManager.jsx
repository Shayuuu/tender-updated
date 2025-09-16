import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bidderData from '../data/Bidderdata';
import Sidebar from './Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';


const CombinedForm = () => {

  useEffect(() => {
    const prevBg = document.body.style.background;
    const prevColor = document.body.style.color;
    document.body.style.background = '#0f0f10';
    document.body.style.color = '#e9e9ee';
    return () => {
      document.body.style.background = prevBg;
      document.body.style.color = prevColor;
    };
  }, []);

  const handleSave = () => {
    if (isNewForm) {
      // Save to localStorage
      const localData = JSON.parse(localStorage.getItem('customBidderData')) || []
      localData.push(formData)
      localStorage.setItem('customBidderData', JSON.stringify(localData))
      navigate('/bidders')
    } else {
      setIsEditing(false)
      setOriginalData({ ...formData })
    }
  }

  const handleCancel = () => {
    if (isNewForm) {
      navigate('/bidders')
    } else {
      setIsEditing(false)
      setFormData({ ...originalData })
    }
  }

  return (
    <div className="combined-form-root">
      <style>{`
        :root{--bg:#0f0f10;--panel:#16171b;--text:#e9e9ee;--muted:#a7a7af;--stroke:#272933;--focus:#7c5cff;--radius:12px;--gap:14px}
        .combined-form-root{min-height:100vh;background:var(--bg);}
        .container{max-width:1200px;margin:24px auto;padding:0 16px;color:var(--text)}
        h1{font-size:18px;margin:0 0 14px}
        .note{color:var(--muted);font-size:12px;margin:0 0 18px}
        .card{background:var(--panel);border:1px solid var(--stroke);border-radius:var(--radius);padding:16px;margin-bottom:16px}
        .card h2{font-size:15px;margin:0 0 12px}
        .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:var(--gap)}
        .grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--gap)}
        @media (max-width:960px){.grid-2,.grid-3{grid-template-columns:1fr}}
        .two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        @media (max-width:1100px){.two-col{grid-template-columns:1fr}}
        label{display:block;font-size:12px;color:var(--muted);margin:0 0 6px}
        input,select,textarea{width:100%;padding:10px 12px;border-radius:10px;background:#101116;color:var(--text);border:1px solid var(--stroke);outline:none}
        textarea{resize:vertical;min-height:90px}
        input:focus,select:focus,textarea:focus{border-color:var(--focus);box-shadow:0 0 0 2px rgba(124,92,255,.20)}
        .actions{display:flex;gap:10px;justify-content:flex-end;margin-top:18px}
        .btn{appearance:none;border:1px solid var(--stroke);background:#1a1b21;color:var(--text);padding:10px 16px;border-radius:10px;font-weight:600;cursor:pointer}
        .btn.primary{background:var(--focus);border-color:var(--focus);color:#fff}
      `}</style>

      <div className="container">
        <h1>Create Entry</h1>
        <div className="note">Combined form. Basics on top, Tender & Project side-by-side (stack on mobile).</div>

        <form>
          <section className="card">
            <h2>Basics (Shared)</h2>
            <div className="grid-2">
              <div><label>Project / Work Name</label><input placeholder="Project name" /></div>
              <div><label>Internal Project No (PFEPL)</label><input placeholder="PRJ/2025/001" /></div>
            </div>
            <div className="grid-2" style={{marginTop:14}}>
              <div>
                <label>Type of Project</label>
                <select><option value="">Select…</option><option>Survey</option><option>Construction</option><option>Consultancy</option></select>
              </div>
              <div><label>Department / Authority</label><input placeholder="Department" /></div>
            </div>
          </section>

          {/* Two columns */}
          <div className="two-col">
            <section className="card">
              <h2>Tender</h2>
              <div className="grid-2">
                <div><label>Unique Tender No</label><input /></div>
                <div><label>Tender ID</label><input /></div>
              </div>
              <div className="grid-2" style={{marginTop:14}}>
                <div><label>Cost of Work (Tender)</label><input type="number" step="0.01" /></div>
                <div><label>Tender Document Fee</label><input type="number" step="0.01" /></div>
              </div>
              <div className="grid-3" style={{marginTop:14}}>
                <div><label>EMD Form</label><select><option value="">Select…</option><option>ONLINE</option><option>BG</option><option>FDR</option></select></div>
                <div><label>EMD Amount</label><input type="number" step="0.01" /></div>
                <div><label>EMD No</label><input /></div>
              </div>
              <div className="grid-3" style={{marginTop:14}}>
                <div><label>Pre-Bid Date</label><input type="date" /></div>
                <div><label>Bid Submission</label><input type="date" /></div>
                <div><label>Bid Opening</label><input type="date" /></div>
              </div>
              <div className="grid-2" style={{marginTop:14}}>
                <div><label>Self / JV</label><select><option value="">Select…</option><option>Self</option><option>JV</option></select></div>
                <div><label>Status</label><select><option value="">Select…</option><option>Bidding Pending</option><option>Submitted</option><option>Awarded</option><option>Not Qualified</option><option>Cancelled</option></select></div>
              </div>
            </section>

            <section className="card">
              <h2>Project</h2>
              <div className="grid-2">
                <div><label>Work Order No</label><input /></div>
                <div><label>Contract Value</label><input type="number" step="0.01" /></div>
              </div>
              <div className="grid-3" style={{marginTop:14}}>
                <div><label>Start Date</label><input type="date" /></div>
                <div><label>Planned Completion</label><input type="date" /></div>
                <div><label>Duration (months)</label><input type="number" /></div>
              </div>
              <div className="grid-3" style={{marginTop:14}}>
                <div><label>PSD No</label><input /></div>
                <div><label>ASD No</label><input /></div>
                <div><label>WCC Taken</label><select><option value="">Select…</option><option>No</option><option>Yes</option></select></div>
              </div>
            </section>
          </div>

          {/* Attachments & remarks */}
          <section className="card">
            <h2>Attachments & Remarks</h2>
            <div className="grid-2">
              <div><label>Attachments</label><input type="file" multiple /></div>
              <div><label>Remarks</label><textarea placeholder="Notes..." /></div>
            </div>
            <div className="actions">
              <button className="btn" type="button">Cancel</button>
              <button className="btn" type="button">Save Draft</button>
              <button className="btn primary" type="submit">Save</button>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
};

export default CombinedForm;
