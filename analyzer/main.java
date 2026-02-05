import java.sql.*;

public class main {
    public static void main(String[] args) {
        // Путь к новой базе данных
        String url = "jdbc:sqlite:../backend/chat_history.db";

        try {
            Connection conn = DriverManager.getConnection(url);
            if (conn != null) {
                System.out.println("\n====================================");
                System.out.println("📊 CORE ANALYTICS SYSTEM (JAVA)");
                System.out.println("====================================\n");

                Statement stmt = conn.createStatement();

                // 1. Аналитика по пользователям (JOIN)
                System.out.println("👤 USER ACTIVITY:");
                String userStatsQuery = 
                    "SELECT u.username, COUNT(m.id) AS msg_count " +
                    "FROM users u " +
                    "LEFT JOIN messages m ON u.id = m.user_id " +
                    "GROUP BY u.username";
                
                ResultSet rsUsers = stmt.executeQuery(userStatsQuery);
                while (rsUsers.next()) {
                    System.out.println(" - " + rsUsers.getString("username") + 
                                       ": " + rsUsers.getInt("msg_count") + " messages");
                }

                System.out.println("\n------------------------------------");

                // 2. Детальная информация о последнем сообщении
                String lastMsgQuery = 
                    "SELECT u.username, m.role, m.content, m.timestamp " +
                    "FROM messages m " +
                    "JOIN users u ON m.user_id = u.id " +
                    "ORDER BY m.id DESC LIMIT 1";

                ResultSet rsLast = stmt.executeQuery(lastMsgQuery);
                if (rsLast.next()) {
                    System.out.println("🕒 LATEST INTERACTION:");
                    System.out.println("User: " + rsLast.getString("username"));
                    System.out.println("Role: " + rsLast.getString("role"));
                    System.out.println("Time: " + rsLast.getString("timestamp"));
                    System.out.println("Text: " + rsLast.getString("content"));
                }

                System.out.println("\n====================================");
                conn.close();
            }
        } catch (Exception e) {
            System.out.println("❌ Database Error: " + e.getMessage());
        }
    }
}