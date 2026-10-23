import React from 'react';
import { FiChevronDown, FiMoreVertical, FiSearch, FiTrash2 } from 'react-icons/fi';
import { RxHamburgerMenu } from 'react-icons/rx';

const TeamSection = ({
  search = '',
  onSearchChange,
  role = '',
  onRoleChange,
  loading = false,
  filteredTeams = [],
  gradients = [],
  dropdownOpen = null,
  dropdownRef,
  onDropdown,
  onDelete,
  onSidebarToggle,
}) => {
  return (
    <div>
      <section className="team-section">
            <div className="team-page-header" style={{ width: '100%' }}>
            <style>{`
              .team-page-header { display: flex; justify-content: center; align-items: center; padding: 16px 18px 0 18px; }
              .team-header-inner { display: flex; align-items: center; justify-content: center; width: 100%; max-width: 820px; }
              .team-sidebar-toggle { display: none; background: #fff; color: #DE3996; border: 1px solid #eee; border-radius: 6px; width: 40px; height: 40px; align-items: center; justify-content: center; font-size: 20px; margin-right: 10px; }
              .team-search-container { position: relative;  display: flex; align-items: center; background: rgba(255,237,247,1); border: none; border-radius: 8px; padding: 8px 14px; min-width: 260px; width: 100%; max-width: 420px; }
              .team-search-container:focus-within{
        box-shadow: 0 0 10px var(--primary-color) !important;
      
      }
              .team-search-input { border: none; outline: none; background: transparent; font-size: 15px; color: #232334; width: 100%; }
              @media (max-width: 992px) {.team-header-inner { justify-content: flex-start; } .team-sidebar-toggle { display: inline-flex; } .team-search-container { margin-left: 8px; max-width: none; } }
              @media (max-width: 500px) {.team-page-header {padding: 16px 10px 0 5px;} }
              [data-theme='dark'] .team-sidebar-toggle, .dark .team-sidebar-toggle { background: #232334 !important; color: #DE3996 !important; border: 1px solid #39395a !important; }
              [data-theme='dark'] .team-search-container, .dark .team-search-container { background: #232334 !important; }
              [data-theme='dark'] .team-search-input, .dark .team-search-input { color: #f3f3fa !important; }
            `}</style>
            <div className="team-header-inner">
              <button className="team-sidebar-toggle" onClick={onSidebarToggle} aria-label="Open sidebar"><RxHamburgerMenu /></button>
              <div className="team-search-container">
                <FiSearch style={{ color: '#999', fontSize: 16, marginRight: 10 }} />
                <input
                  className="team-search-input"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                />
              </div>
            </div>

          </div>


            <div className="team-section-card">
              
              {/* Header */}
              <h2 className="font-weight-bold your-team" style={{ marginBottom: 24 }}>Your Teams</h2>
              {/* Modern Filter Row */}
              <div className="team-filters">
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search teams..."
                    value={search}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                  style={{
                   backgroundColor: 'rgba(255,237,247,1)',
                    border: '1px solid #eee',
                    borderRadius: 8,
                    padding: '10px 16px',
                    fontSize: 15,
                    width: 360,
                    maxWidth: '100%',
                  }}
                  />
                <div style={{ position: 'relative', width: 180, maxWidth: '100%' }}>
                  <select
                    className="form-control team-role-select"
                    id="role-select"
                    value={role}
                    onChange={(e) => onRoleChange?.(e.target.value)}
                    style={{
                      border: '1px solid #eee',
                      borderRadius: 8,
                      padding: '10px 36px 10px 16px',
                      fontSize: 15,
                      width: '100%',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <FiChevronDown style={{
                    position: 'absolute',
                    right: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: '#888',
                    fontSize: 18,
                  }} />
                </div>
                <style>{`
                  @media (max-width: 700px) {
                    .team-filters input, .team-filters .team-role-select { width: 100% !important; min-width: 0 !important; }
                    .team-filters > div, .team-filters > input { width: 100% !important; }
                  }
                    @media (max-width: 500px) {
                    .team-filters { flex-direction: column !important; gap: 10px !important; padding: 10px !important; }
                  }
                `}</style>
              </div>
              {/* Team List */}
              <div className="row flex-wrap">
                {loading ? (
                  <div className="col-12 text-center py-5">Loading...</div>
                ) : filteredTeams.length === 0 ? (
                  <div className="col-12 text-center py-5">No teams found.</div>
                ) : (
                  filteredTeams.map((team, idx) => (
                    <div className="col-md-6 col-lg-4 mb-4 padding" key={team.id} 
                    // style={filteredTeams.length === 1 ? { minWidth: 300, maxWidth: 340, width: '100%' } : { maxWidth: 340 }}
                    >
                      <div className="team-card card-gradient-1" style={{ background: 'white', position: 'relative', color: '#222', minHeight: filteredTeams.length === 1 ? 180 : undefined }}>
                        <div className="gradient-header" style={{ background: gradients[idx % gradients.length], height: 80, borderTopLeftRadius: 14, borderTopRightRadius: 14 }} />
                        <div className="card-content" style={{ display: 'flex', alignItems: 'center', padding: 20, background: 'white', borderBottomLeftRadius: 14, borderBottomRightRadius: 14 }}>
      
                          {/* Avatar and Name */}
                          <img
                            src={team.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(team.name)}&background=DE3996&color=fff&size=128`}
                            className="profile-img"
                            alt="Profile"
                            style={{ width: 56, height: 56, borderRadius: '50%', marginRight: 16 }}
                          />
                          
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span style={{ fontWeight: 600, fontSize: 18 }}>{team.name}</span>
                              <div style={{ position: 'relative', display: 'inline-block' }}>
                              <button
                                className="action-btn"
                                type="button"
                                onClick={() => onDropdown?.(team.id)}
                                  style={{ background: 'none', border: 'none', padding: 0, marginLeft: 8, position: 'relative', zIndex: 201 }}
                              >
                                <FiMoreVertical size={20} />
                              </button>
                                {dropdownOpen === team.id && (
                                  <div ref={dropdownRef} className="dropdown-menu dropdown-menu-right show" style={{ position: 'absolute', left: '0',   transform: 'translateX(-80%)', top: '100%', marginTop: 10, zIndex: 200, minWidth: 140, background: '#f7f7f7', boxShadow: '0 4px 12px rgba(34,34,59,0.10)', borderRadius: 10, padding: '6px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                                    <button className="dropdown-item delete delete-team" onClick={() => onDelete?.(team.id)}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '90%',
                                        background: 'none',
                                        border: 'none',
                                        color: '#222',
                                        fontWeight: 600,
                                        fontSize: 15,
                                        padding: '6px 0',
                                        borderRadius: 7,
                                        cursor: 'pointer',
                                        gap: 8,
                                        transition: 'color 0.18s',
                                      }}
                                      
                                    >
                                      <FiTrash2 style={{ marginRight: 6, color: '#222', transition: 'color 0.18s' }} size={18}/> Delete team
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="team-date-row" style={{ color: '#888', fontSize: 15, marginTop: 6 }}>
                              {team.created_at ? new Date(team.created_at).toLocaleDateString() : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
    </div>
  )
}

export default TeamSection
