import java.util.Scanner;

public class PrelimGradeCalculator {

    public static void main(String[] args) {

        Scanner input = new Scanner(System.in);

        System.out.println("==========================================");
        System.out.println("     PRELIM GRADE COMPUTATION SYSTEM");
        System.out.println("==========================================\n");

        // User Inputs
        System.out.print("Enter Attendance Grade: ");
        double attendance = input.nextDouble();

        System.out.print("Enter Lab Work 1 Grade: ");
        double lab1 = input.nextDouble();

        System.out.print("Enter Lab Work 2 Grade: ");
        double lab2 = input.nextDouble();

        System.out.print("Enter Lab Work 3 Grade: ");
        double lab3 = input.nextDouble();

        // Computations
        double labAverage = (lab1 + lab2 + lab3) / 3;
        double classStanding = (attendance * 0.40) + (labAverage * 0.60);

        double requiredPrelimPass =
                (75 - (classStanding * 0.30)) / 0.70;

        double requiredPrelimExcellent =
                (100 - (classStanding * 0.30)) / 0.70;

        // Output
        System.out.println("\n---------- COMPUTATION RESULTS ----------");
        System.out.printf("Attendance Grade     : %.2f%n", attendance);
        System.out.printf("Lab Work Average     : %.2f%n", labAverage);
        System.out.printf("Class Standing       : %.2f%n", classStanding);

        System.out.println("\n---------- REQUIRED PRELIM EXAM ----------");
        System.out.printf("To PASS (75)         : %.2f%n", requiredPrelimPass);
        System.out.printf("To be EXCELLENT (100): %.2f%n", requiredPrelimExcellent);

        // Remarks
        System.out.println("\n---------- REMARKS ----------");

        if (requiredPrelimPass > 100) {
            System.out.println("⚠️ Passing is NOT achievable this prelim period.");
        } else if (requiredPrelimPass <= 0) {
            System.out.println("✅ You have already PASSED based on Class Standing.");
        } else {
            System.out.println("📌 You need to perform well in the Prelim Exam.");
        }

        System.out.println("\n==========================================");
        System.out.println("          END OF COMPUTATION");
        System.out.println("==========================================");

        input.close();
    }
}
