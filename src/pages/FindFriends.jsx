import React, { useState } from "react";

const STUDENTS = [
  {
    name: "Sarah Chen",
    major: "Computer Science",
    year: "Junior",
    avatar: "👩‍🎓",
    interests: "Music, Photography",
    location: "Johnson Hall",
    mutual: 12,
    btnClass: "friend-btn-purple",
    btnText: "Send Friend Request"
  },
  {
    name: "Mike Rodriguez",
    major: "Business",
    year: "Sophomore",
    avatar: "👨‍🎓",
    interests: "Basketball, Gaming",
    location: "Smith Residence",
    mutual: 8,
    btnClass: "friend-btn-blue",
    btnText: "Send Friend Request"
  },
  {
    name: "Emma Wilson",
    major: "Art & Design",
    year: "Senior",
    avatar: "👩‍🎓",
    interests: "Art, Theater",
    location: "Creative Arts Building",
    mutual: 15,
    btnClass: "friend-btn-green",
    btnText: "Send Friend Request"
  }
];

export default function FindFriends() {
  const [search, setSearch] = useState("");

  return (
    <div style={{ background: "#fbfcff", minHeight: "100vh", paddingBottom: "3rem" }}>
      <div style={{ fontWeight: 800, fontSize: 32, margin: "36px 0 0 44px" }}>Student Find Friends</div>
      <div style={{ fontWeight: 800, fontSize: 28, marginLeft: 44, marginTop: 32 }}>Find Friends</div>
      <div style={{ marginLeft: 44, fontSize: 18, color: "#5d5f72", marginBottom: 20 }}>
        Connect with fellow students and expand your campus network!
      </div>
      <div style={{
        margin: "0 auto 38px auto", width: 1002, display: "flex", alignItems: "center",
        background: "#fff", borderRadius: 13, boxShadow: "0 2px 12px #ebedf7", padding: "19px 28px"
      }}>
        <input
          style={{
            flex: 1, borderRadius: 8, border: "1.5px solid #ebedfa", padding: "13px 23px",
            fontSize: 18, background: "#fafbff", marginRight: 18
          }}
          placeholder="Search by name, interests, or major..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          style={{
            background: "#a96cff", color: "#fff", border: "none", fontWeight: 700,
            borderRadius: 8, padding: "12px 32px", fontSize: 17, cursor: "pointer"
          }}>
          🔍 Search
        </button>
      </div>
      <div style={{
        display: "flex", gap: 42, justifyContent: "center"
      }}>
        {STUDENTS.map(student =>
          <div key={student.name} style={{
            background: "#fff", borderRadius: 19, width: 340, boxShadow: "0 2px 13px #f3f1fd",
            padding: "38px 22px 25px 22px", display: "flex", flexDirection: "column", alignItems: "center"
          }}>
            <div style={{
              fontSize: 54, background: student.btnClass === "friend-btn-purple" ? "linear-gradient(135deg,#c899fc,#f78cff)" :
                student.btnClass === "friend-btn-blue" ? "linear-gradient(135deg,#87e6ff 0,#2e8bdb 100%)" :
                "linear-gradient(135deg,#79edb1,#18af4b)", width: 84, height: 84,
              borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18
            }}>
              {student.avatar}
            </div>
            <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 0, textAlign: "center" }}>{student.name}</div>
            <div style={{ color: "#575b79", fontWeight: 600, fontSize: 16 }}>{student.major} &bull; {student.year}</div>
            <div style={{ color: "#5a60a6", margin: "14px 0 3px 0", fontSize: 16 }}>
              {student.btnClass === "friend-btn-purple" && <>
                <span role="img" aria-label="music">🎶</span> {student.interests}<br />
                <span role="img" aria-label="location">📍</span> {student.location}
              </>}
              {student.btnClass === "friend-btn-blue" && <>
                <span role="img" aria-label="sports">🏀</span> Basketball, Gaming<br />
                <span role="img" aria-label="location">📍</span> {student.location}
              </>}
              {student.btnClass === "friend-btn-green" && <>
                <span role="img" aria-label="art">🎨</span> Art, Theater<br />
                <span role="img" aria-label="location">📍</span> {student.location}
              </>}
            </div>
            <div style={{ color: "#ad59ee", margin: "6px 0 18px 0", fontSize: 15 }}>
              🎉 {student.mutual} mutual events
            </div>
            <button className={student.btnClass} style={{
              width: "100%", fontWeight: 700, fontSize: 17, border: "none",
              borderRadius: 10, padding: "14px 0", marginTop: "auto", cursor: "pointer"
            }}>
              {student.btnText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

