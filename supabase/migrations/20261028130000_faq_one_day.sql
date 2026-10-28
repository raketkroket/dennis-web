-- An honest answer to the many searches for a bathroom renovated in one day.
-- Skipped if Dennis already has a question with this id.

insert into public.faqs (id, page, question_nl, answer_nl, question_en, answer_en, is_visible, sort_order)
values ('faq-badkamer-een-dag', 'badkamer', 'Kan een badkamer in één dag worden gerenoveerd?', 'Niet bij een complete renovatie zoals wij die uitvoeren. Slopen, leidingwerk, tegelwerk en afwerking vragen samen vaak enkele weken, afhankelijk van de omvang. De planning bespreken wij vooraf met u.', 'Can a bathroom be renovated in one day?', 'Not with a complete renovation as we carry it out. Demolition, plumbing, tiling and finishing together often take several weeks, depending on the scope. We agree the schedule with you in advance.', true, 25)
on conflict (id) do nothing;
