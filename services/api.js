
const EduLearnAPI = {
    async getUserProfile() {
        try {
            const response = await fetch("db.json"); 
            const data = await response.json(); 
            
            const userId = sessionStorage.getItem('user_id') || "2"; 
            return data.users.find(u => u.id === userId);
        } catch (error) {
            console.error("API Error:", error);
            return null;
        }
    }
};