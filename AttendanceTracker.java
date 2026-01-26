package com.example;

import javax.swing.*;
import java.awt.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

/**
 * Attendance Tracker - Java Swing application
 */
public class AttendanceTracker {

    private JFrame frame;
    private JTextField nameField;
    private JTextField courseYearField;
    private JTextField timeInField;
    private JTextField eSignatureField;

    public AttendanceTracker() {
        initializeUI();
    }

    private void initializeUI() {
        frame = new JFrame("Attendance Tracker");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(600, 350);
        frame.setLocationRelativeTo(null);

        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception ignored) {}

        JPanel mainPanel = new JPanel(new BorderLayout(10, 10));
        mainPanel.setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));

        JLabel titleLabel = new JLabel("Attendance Tracker", JLabel.CENTER);
        titleLabel.setFont(new Font("Arial", Font.BOLD, 22));
        mainPanel.add(titleLabel, BorderLayout.NORTH);

        JPanel formPanel = new JPanel(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(8, 8, 8, 8);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        // Attendance Name
        gbc.gridx = 0; gbc.gridy = 0;
        formPanel.add(new JLabel("Attendance Name:"), gbc);

        gbc.gridx = 1;
        nameField = new JTextField(20);
        formPanel.add(nameField, gbc);

        // Course / Year
        gbc.gridx = 0; gbc.gridy = 1;
        formPanel.add(new JLabel("Course / Year:"), gbc);

        gbc.gridx = 1;
        courseYearField = new JTextField(20);
        formPanel.add(courseYearField, gbc);

        // Time In
        gbc.gridx = 0; gbc.gridy = 2;
        formPanel.add(new JLabel("Time In:"), gbc);

        gbc.gridx = 1;
        timeInField = new JTextField(20);
        timeInField.setEditable(false);
        formPanel.add(timeInField, gbc);

        // E-Signature
        gbc.gridx = 0; gbc.gridy = 3;
        formPanel.add(new JLabel("E-Signature:"), gbc);

        gbc.gridx = 1;
        eSignatureField = new JTextField(20);
        eSignatureField.setEditable(false);
        formPanel.add(eSignatureField, gbc);

        mainPanel.add(formPanel, BorderLayout.CENTER);

        // Buttons
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));

        JButton submitButton = new JButton("Submit");
        submitButton.addActionListener(e -> submitAttendance());

        JButton clearButton = new JButton("Clear");
        clearButton.addActionListener(e -> clearFields());

        buttonPanel.add(submitButton);
        buttonPanel.add(clearButton);

        mainPanel.add(buttonPanel, BorderLayout.SOUTH);

        frame.setContentPane(mainPanel);

        refreshFields();
        frame.setVisible(true);
    }

    // Submit attendance with validation
    private void submitAttendance() {
        String name = nameField.getText().trim();
        String course = courseYearField.getText().trim();

        if (name.isEmpty() || course.isEmpty()) {
            JOptionPane.showMessageDialog(
                    frame,
                    "Please fill in all required fields!",
                    "Error",
                    JOptionPane.ERROR_MESSAGE
            );
            return;
        }

        JOptionPane.showMessageDialog(
                frame,
                "Attendance Submitted Successfully!\n\n"
                        + "Name: " + name + "\n"
                        + "Course/Year: " + course + "\n"
                        + "Time In: " + timeInField.getText(),
                "Success",
                JOptionPane.INFORMATION_MESSAGE
        );

        clearFields();
    }

    private void refreshFields() {
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        timeInField.setText(now.format(formatter));
        eSignatureField.setText(UUID.randomUUID().toString());
    }

    private void clearFields() {
        nameField.setText("");
        courseYearField.setText("");
        refreshFields();
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(AttendanceTracker::new);
    }
}
