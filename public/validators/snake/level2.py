# validators.py
import unittest

valid_directions = ['N', 'E', 'S', 'W']

class TestLevel2(unittest.TestCase):
    def test_return_type(self):
        direction = nextMove()
        self.assertIsInstance(direction, str, "Ta fonction doit retourner une chaîne de caractères.")

    def test_direction_validity(self):
        direction = nextMove()
        self.assertIn(direction, valid_directions, f"'{direction}' n’est pas une direction valide ({valid_directions}).")

    

def run_tests():
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestLevel2)
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

    failures = []
    for test_case, traceback in result.failures:
        last_line = traceback.strip().split("\n")[-1]
        message = last_line.split(": ", 1)[-1]
        failures.append(f"{message}")

    return {
        "success": result.wasSuccessful(),
        "message": "✔ Tous les tests passés" if result.wasSuccessful() else f"✘ {len(result.failures)} échec(s)",
        "failures": failures
    }