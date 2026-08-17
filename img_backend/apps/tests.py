from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse


class InpaintRESTAPITests(APITestCase):
    def test_health_check_endpoint(self):
        """
        Verify GET /api/health/ returns HTTP 200 with status ok.
        """
        url = reverse('health')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('status'), 'ok')
        self.assertIn('device', response.data)

    def test_inpaint_get_endpoint(self):
        """
        Verify GET /api/inpaint/ returns HTTP 200 with usage details.
        """
        url = reverse('inpaint')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('required_files', response.data)

    def test_inpaint_endpoint_invalid_data(self):
        """
        Verify POST /api/inpaint/ returns HTTP 400 when missing required files.
        """
        url = reverse('inpaint')
        response = self.client.post(url, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('image', response.data)
        self.assertIn('mask', response.data)

    def test_results_history_endpoint(self):
        """
        Verify GET /api/results/ returns HTTP 200 and an array.
        """
        url = '/api/results/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
