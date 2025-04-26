import unittest
from unittest.mock import patch
import random

valid_directions = ['N', 'E', 'S', 'W']

# Niveau 1
class TestLevel1(unittest.TestCase):
    def test_next_move_returns(self):
        if next_move() is None:
            self.fail("La fonction 'next_move()' ne retourne rien. Assurez-vous qu'elle retourne une valeur.")

    def test_return_type(self):
        direction = next_move()
        self.assertIsInstance(direction, str, "Ta fonction doit retourner une chaîne de caractères.")

    def test_direction_validity(self):
        direction = next_move()
        self.assertIn(direction, valid_directions, f"'{direction}' n’est pas une direction valide ({valid_directions}).")

    def test_direction_south(self):
        direction = next_move()
        self.assertEqual(direction, 'S', "Le serpent devrait aller vers le sud.")


# Niveau 2
class TestLevel2(unittest.TestCase):
    def test_next_move_returns(self):
        if next_move() is None:
            self.fail("La fonction 'next_move()' ne retourne rien.")

    def test_return_type(self):
        direction = next_move()
        self.assertIsInstance(direction, str, "Ta fonction doit retourner une chaîne de caractères.")

    def test_direction_validity(self):
        direction = next_move()
        self.assertIn(direction, valid_directions, f"'{direction}' n’est pas une direction valide ({valid_directions}).")

    @patch('random.choice')
    def test_random_choice_called(self, mock_choice):
        mock_choice.return_value = 'N'
        direction = next_move()
        mock_choice.assert_called_once()


# Niveau 3
class TestLevel3(unittest.TestCase):
    def test_next_move_returns(self):
        if next_move() is None:
            self.fail("La fonction 'next_move()' ne retourne rien.")

    def test_return_type(self):
        direction = next_move()
        self.assertIsInstance(direction, str, "Ta fonction doit retourner une chaîne de caractères.")

    def test_direction_validity(self):
        direction = next_move()
        self.assertIn(direction, valid_directions, f"'{direction}' n’est pas une direction valide ({valid_directions}).")

    def test_no_wall_direction(self):
        for _ in range(100):
            direction = next_move()
            # ici on vérifie juste que la direction choisie n'est PAS un mur
            self.assertFalse(is_wall(direction), "Le serpent doit choisir une direction sans mur.")

    def test_randomness_distribution(self):
        counts = {d: 0 for d in valid_directions}
        for _ in range(1000):
            direction = next_move()
            counts[direction] += 1

        # On vérifie que toutes les directions valides sans mur ont été choisies au moins une fois
        possible_dirs = [d for d in valid_directions if not is_wall(d)]
        for dir in possible_dirs:
            self.assertGreater(counts[dir], 0, f"La direction '{dir}' n'a jamais été choisie.")


# Niveau 4
class TestLevel4(unittest.TestCase):
    
    def setUp(self):
        # Initialisation avant chaque test
        self.grille_largeur = 10  # Exemple de largeur de grille
        self.grille_hauteur = 10  # Exemple de hauteur de grille
        self.tete_x = 0
        self.tete_y = 0
    
    def tearDown(self):
        # Cleanup si nécessaire
        pass

    def test_next_move_returns(self):
        if next_move() is None:
            self.fail("La fonction 'next_move()' ne retourne rien.")

    def test_return_type(self):
        direction = next_move()
        self.assertIsInstance(direction, str, "Ta fonction doit retourner une chaîne de caractères.")

    def test_direction_validity(self):
        direction = next_move()
        self.assertIn(direction, valid_directions, f"'{direction}' n’est pas une direction valide ({valid_directions}).")

    def test_no_wall_direction(self):
        for _ in range(100):
            direction = next_move()
            # On s'assure que la direction choisie n'est pas un mur
            self.assertFalse(is_wall(direction), "Le serpent doit choisir une direction sans mur.")

    def test_randomness_distribution(self):
        counts = {d: 0 for d in valid_directions}
        for _ in range(1000):
            direction = next_move()
            counts[direction] += 1

        possible_dirs = valid_directions
        for dir in possible_dirs:
            self.assertGreater(counts[dir], 0, f"La direction '{dir}' n'a jamais été choisie.")

    def test_is_wall(self):
        # Test du mur au Nord (tête en haut)
        self.tete_x = 0
        self.tete_y = 0
        self.assertTrue(is_wall('N'), "Le mur au Nord devrait être détecté quand on est en haut.")

        # Test du mur à l'Ouest (tête à gauche)
        self.tete_x = 0
        self.tete_y = 0
        self.assertTrue(is_wall('W'), "Le mur à l'Ouest devrait être détecté quand on est à gauche.")

        # Test du mur au Sud (tête en bas de la grille)
        self.tete_x = 0
        self.tete_y = self.grille_hauteur - 1
        self.assertFalse(is_wall('S'), "Il ne devrait pas y avoir de mur au Sud.")

        # Test du mur à l'Est (tête à droite de la grille)
        self.tete_x = self.grille_largeur - 1
        self.tete_y = 0
        self.assertFalse(is_wall('E'), "Il ne devrait pas y avoir de mur à l'Est.")


# Runner
def run_tests(test_case):
    loader = unittest.TestLoader()
    test_names = loader.getTestCaseNames(test_case)

    result = unittest.TestResult()
    for name in test_names:
        test = test_case(name)
        test.run(result)
        if not result.wasSuccessful():
            break

    failures = []
    for test_case, traceback in result.failures + result.errors:
        last_line = traceback.strip().split("\n")[-1]
        message = last_line.split(": ", 1)[-1]
        failures.append(f"{message}")

    return {
        "success": result.wasSuccessful(),
        "message": "✔ Tous les tests passés" if result.wasSuccessful() else "✘ Échec",
        "failures": failures
    }
