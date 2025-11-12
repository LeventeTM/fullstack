<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ItemFactory extends Factory
{
    public function definition()
    {
        $categories = [
            'tejtermék' => [
                ['name' => 'Tej 1.5%', 'price' => 420, 'weight' => 1, 'image' => 'tej.webp'],
                ['name' => 'Vaj', 'price' => 890, 'weight' => 0.2, 'image' => 'vaj.webp'],
                ['name' => 'Joghurt', 'price' => 320, 'weight' => 0.15, 'image' => 'joghurt.webp'],
                ['name' => 'Kefir', 'price' => 280, 'weight' => 0.2, 'image' => 'kefir.webp'],
                ['name' => 'Trappista sajt', 'price' => 2100, 'weight' => 0.5, 'image' => 'trappista.webp'],
                ['name' => 'Túró', 'price' => 450, 'weight' => 0.25, 'image' => 'turo.webp'],
            ],
            'gyümölcs' => [
                ['name' => 'Alma', 'price' => 350, 'weight' => 0.25, 'image' => 'alma.webp'],
                ['name' => 'Banán', 'price' => 420, 'weight' => 0.3, 'image' => 'banan.webp'],
                ['name' => 'Narancs', 'price' => 560, 'weight' => 0.35, 'image' => 'narancs.webp'],
                ['name' => 'Körte', 'price' => 400, 'weight' => 0.3, 'image' => 'korte.webp'],
                ['name' => 'Szőlő', 'price' => 780, 'weight' => 0.4, 'image' => 'szolo.webp'],
                ['name' => 'Kiwi', 'price' => 990, 'weight' => 0.25, 'image' => 'kiwi.webp'],
            ],
            'zöldség' => [
                ['name' => 'Paradicsom', 'price' => 890, 'weight' => 0.3, 'image' => 'paradicsom.webp'],
                ['name' => 'Uborka', 'price' => 750, 'weight' => 0.25, 'image' => 'uborka.webp'],
                ['name' => 'Paprika', 'price' => 650, 'weight' => 0.2, 'image' => 'paprika.webp'],
                ['name' => 'Répa', 'price' => 400, 'weight' => 0.15, 'image' => 'repa.webp'],
                ['name' => 'Hagyma', 'price' => 300, 'weight' => 0.1, 'image' => 'hagyma.webp'],
                ['name' => 'Krumpli', 'price' => 250, 'weight' => 0.5, 'image' => 'krumpli.webp'],
            ],
            'pékáru' => [
                ['name' => 'Kenyér fehér', 'price' => 550, 'weight' => 0.5, 'image' => 'kenyer.webp'],
                ['name' => 'Zsemle', 'price' => 100, 'weight' => 0.08, 'image' => 'zsemle.webp'],
                ['name' => 'Kifli', 'price' => 90, 'weight' => 0.07, 'image' => 'kifli.webp'],
                ['name' => 'Kalács', 'price' => 890, 'weight' => 0.4, 'image' => 'kalacs.webp'],
                ['name' => 'Teljes kiőrlésű kenyér', 'price' => 650, 'weight' => 0.6, 'image' => 'teljes_kenyer.webp'],
                ['name' => 'Croissant', 'price' => 450, 'weight' => 0.12, 'image' => 'croissant.webp'],
            ],
            'hús' => [
                ['name' => 'Csirkemell filé', 'price' => 1800, 'weight' => 1.0, 'image' => 'csirkemell.webp'],
                ['name' => 'Darálthús marha', 'price' => 2400, 'weight' => 0.5, 'image' => 'daralthus.webp'],
                ['name' => 'Sertéskaraj', 'price' => 2100, 'weight' => 1.0, 'image' => 'serteskaraj.webp'],
                ['name' => 'Csirkecomb', 'price' => 1600, 'weight' => 0.8, 'image' => 'csirkecomb.webp'],
                ['name' => 'Pulykamell', 'price' => 2200, 'weight' => 0.9, 'image' => 'pulykamell.webp'],
                ['name' => 'Bacon szeletelt', 'price' => 1900, 'weight' => 0.25, 'image' => 'bacon.webp'],
            ],
        ];

        // A fájl elérés miatt átalakítjuk a kategória neveket ékezet nélkülivé
        $folderMap = [
            'tejtermék' => 'tejtermek',
            'gyümölcs' => 'gyumolcs',
            'zöldség' => 'zoldseg',
            'pékáru' => 'pekaru',
            'hús' => 'hus',
        ];

        $category = $this->faker->randomElement(array_keys($categories));
        $product = $this->faker->randomElement($categories[$category]);
        $brand = $this->faker->randomElement(['Alfa', 'BioFarm', 'FreshCo', 'Natur', 'GoodFood']);

        $folderName = $folderMap[$category];

        return [
            'name' => "{$brand} {$product['name']}",
            'category' => $category,
            'price' => $product['price'] + $this->faker->numberBetween(-50, 50),
            'stock' => $this->faker->numberBetween(10, 200),
            'weight' => $product['weight'],
            'description' => $this->faker->sentence(10),
            'image' => "/images/products/{$folderName}/{$product['image']}",
        ];
    }
}
