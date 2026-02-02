package JAVA;

/*
 * Programmer: Rishamay Lumaban
 * Student ID: 25-1407-939
 */

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.io.*;
import java.util.Scanner;

public class StudentRecordApp extends JFrame {

    private JTable table;
    private DefaultTableModel tableModel;
    private JTextField tfID, tfName, tfGrade;
    private JButton btnAdd, btnDelete;

    public StudentRecordApp() {
        setTitle("Records - Rishamay Lumaban 25-1407-939");
        setSize(900, 400);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());

        // Table headers match CSV columns
        String[] columns = {"ID", "First Name", "Last Name", "Email", "Gender", "Grade", "City", "Country"};
        tableModel = new DefaultTableModel(columns, 0);
        table = new JTable(tableModel);
        JScrollPane scrollPane = new JScrollPane(table);
        add(scrollPane, BorderLayout.CENTER);

        // Load CSV data on startup
        loadCSV("class_records.csv");

        // Input panel
        JPanel inputPanel = new JPanel(new FlowLayout());
        tfID = new JTextField(5);
        tfName = new JTextField(10);
        tfGrade = new JTextField(5);
        btnAdd = new JButton("Add");
        btnDelete = new JButton("Delete");

        inputPanel.add(new JLabel("ID:"));
        inputPanel.add(tfID);
        inputPanel.add(new JLabel("Name:"));
        inputPanel.add(tfName);
        inputPanel.add(new JLabel("Grade:"));
        inputPanel.add(tfGrade);
        inputPanel.add(btnAdd);
        inputPanel.add(btnDelete);

        add(inputPanel, BorderLayout.SOUTH);

        // Button actions
        btnAdd.addActionListener(e -> addRecord());
        btnDelete.addActionListener(e -> deleteRecord());

        setVisible(true);
    }

    private void loadCSV(String fileName) {
        try (Scanner scanner = new Scanner(new File(fileName))) {
            // Skip header if CSV has one
            if (scanner.hasNextLine()) scanner.nextLine();
            while (scanner.hasNextLine()) {
                String line = scanner.nextLine();
                String[] data = line.split(",");
                tableModel.addRow(data);
            }
        } catch (FileNotFoundException e) {
            JOptionPane.showMessageDialog(this, "CSV file not found: " + fileName);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error reading CSV: " + e.getMessage());
        }
    }

    private void addRecord() {
        String id = tfID.getText();
        String name = tfName.getText();
        String grade = tfGrade.getText();

        // Fill empty columns for CSV format (8 columns total)
        String[] newRow = {id, name, "", "", "", grade, "", ""};
        tableModel.addRow(newRow);

        tfID.setText("");
        tfName.setText("");
        tfGrade.setText("");
    }

    private void deleteRecord() {
        int selectedRow = table.getSelectedRow();
        if (selectedRow != -1) {
            tableModel.removeRow(selectedRow);
        } else {
            JOptionPane.showMessageDialog(this, "Please select a row to delete.");
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(StudentRecordApp::new);
    }
}
